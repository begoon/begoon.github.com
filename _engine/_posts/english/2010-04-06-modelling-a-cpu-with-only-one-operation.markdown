---
layout: post
title: "Modelling a CPU with only one operation"
language: english
date: 2010-04-06 00:00
comments: true
blogspot: http://meta-coding.blogspot.com/2010/04/cpu-executing-just-one-operation.html
categories: 
- project
- norcpu
- english
---
Going further with bitwise tips and tricks I will tell about a model of a CPU based on a single operation - NOR (or Peirce arrow).

In the mid-nineties in the FIDO discussion group RU.HACKER I come across an interesting hackme.

Usually "hackme" is an application which is published as a challenge to be hacked. It prompts for a password and the goal is to crack it. You may guess the password disassembling the code or could just patch the code and disable the password check and so on.

That "hackme" from RU.HACKER was originally written by famous Russian hacker and security expert Alexander Peslyak (the author of John The Ripper John The Ripper and Openwall Linux).

Unlike other "hackme" around Alexander's approach didn't have any anti-debugger tricks at all preventing disassembling and tracing. Furthermore it contained less then hundred bytes of x86 code. The code executed a trivial loop calculating only one operation - NOR (Pierce arrow). And the entire business logic (interaction with the console and password calculations) was build on top this primitive. Effectively this is a model of CPU having only one command.

The memory model of this CPU is flat and it consists of 16-bit words. The address space is from 0x0000 to 0xFFFF. A CPU instruction has 3 operands. There is no an instruction code because the command is always the same - NOR. Each operand represents an address.

To execute an instruction CPU takes the left argument of NOR from an address given in the first operand and the right argument from an address given in the second operand. Then it implies bitwise 16-bit NOR between them and puts the result to the address given in the third argument. Afterwards the instruction pointer is increment by 3 to shift to the next instruction and the cycle repeats.

The instruction pointer (`IP`) is also located in the address space and JUMP operation could be implemented just by putting a jump address to the memory location of `IP`.

The original NOR interpreter was written on x86 assembly:

{% codeblock lang:nasm %}
cld
emCPU:
mov  si,emIP
lodsw
xchg ax,di
mov  di,[di]
lodsw
xchg ax,bx
or   di,[bx]
lodsw
xchg ax,di
not  ax
mov  emIP,si
stosw
jmp  short emCPU
{% endcodeblock %}

Nothing prevents to write it on any language, for example, Python.

{% codeblock lang:python %}
def nor(a, b):
  return ~(a | b) & 0xFFFF

def norcpu():
  while 1:
    i = mem[IP];
    a = mem[i + 0]
    b = mem[i + 1]
    r = mem[i + 2]
    mem[IP] = i + 3
    f = nor(mem[a], mem[b])
    mem[r] = f
{% endcodeblock %}

Why NOR? The Boolean algebra theory says that any of 14 of 16 Boolean functions could be calculated using just the rest two - NOR and NAND. For instance:

    NOT(a) = NOR(a, a)
    AND(a, b) = NOT(OR(NOT(a), NOT(b)))
    OR(a, b) = NOT(NOR(a, b))
    XOR(a, b) = OR(AND(a, NOT(b)), AND(NOT(a), b)))

The move operation `MOVE(src, dst)` could be implemented via `OR`:

    mem[dst] = OR(mem[src], mem[src])

A conditional jump is either implemented via Boolean functions. If `cond` equals 0xFFFF (true), the jump to `addr` is performed. If `cond` equals 0x0000 (false) CPU sequentially takes the next instruction following `JUMP`.

    mem[IP] = OR(AND(addr, cond), AND(mem[IP], cond))

Or in the NOR interpreter notation:

    AND addr, cond, @t1
    AND IP, cond, @t2
    OR @t1, @t2, IP

where `@t1` and `@t2` are temporary variables. The `AND` and `OR` commands will be also expanded to sets of NORs as shown above.

Eventually we have Boolean functions, copy/move, unconditional and conditional jumps. We just lack the addition/subtraction and shifts. Having that we could implement the subroutine stack and then any complex computations can be made by this primitive CPU.

The original Alexander's NOR CPU implementation had a workaround which allows running the native x86 code. The workaround was based on the fact that the NOR interpreter also resides in its address space and can modify itself. To execute the native code a special high level macro (let's say emCallX86) uses MOVE operation (see above) to place two bytes at the beginning of the interpreter code (effectively it saves the original two bytes and put other two instead). Those two new bytes are an x86 short jump instruction. When the interpreter begins the next cycle it simply jumps out to an arbitrary x86 code. In the end the native code restores the original two bytes of the interpreter and returns the execution flow to it.

An interaction with DOS I/O and an addition of two 16-bit integers with carry were implemented in native code.

Frankly speaking I don't find it feasible to implement a full 16-bit adder using Boolean functions only. The original NOR interpreter only performed bitwise NOR. It wasn't possible to move/shift an individual bit to another one but the [full binary adder][] needs it to consider the carry.

[full binary adder]: http://en.wikipedia.org/wiki/Adder_(electronics)

Recently I've come back to this NOR interpreter approach but in Python world. I've modified the original idea a bit to simplify (or just make it possible) an implementation of addition using NOR only, without native code at all. I've introduced one extra operation in the interpreter ñ the result of NOR is cyclically shifted left by 1 bit and stored the special location in memory.

{% codeblock lang:python %}
def norcpu():
  while 1:
    i = mem[IP];
    a = mem[i + 0]
    b = mem[i + 1]
    r = mem[i + 2]
    mem[IP] = i + 3
    f = nor(mem[a], mem[b])
    mem[r] = f
    mem[S] = ((f >> 31) & 1) | ((f & 0x7FFF) << 1)
{% endcodeblock %}

There are two special locations now: `IP` (instruction pointer) and `S` (shift register).

Let's try to implement the full addition of 16-bit words with carry. I will use a simple macro assembler.

The full 1 bit adder formulas are:

    sum = (a ^ b) ^ carry
    carry = (a & b) | (carry & (a ^ b))

Now in the NOR CPU assembly:

    ; Input:
    ;  mask  - a current bit mask (0x0001, 0x0002, 0x0004, 0x0008 etc)
    ;  carry ñ a carry from the previous bit (the masked applied)
    ;  a, b  - an argument addresses
    ;  r     - an address of the result
    ; Output:
    ;  r     - a result
    ;  carry - a carry to the next bit (already left shifted with respect to the mask)
    ;  mask  - a mask left shifted by one bit
    ;
    ; Variables with '@' prefix are local for the macro.
    ;
    !macro FADD mask, carry, a, b, r
      XOR a, b, @t1              ; Formula: sum = (a ^ b) ^ carry.
      XOR @t1, carry, @bit_r     ; 
      AND @bit_r, mask, @bit_r   ; Mask all bits in @bit_r expect the current one
      OR @bit_r, r, r            ; Save the bit to the result: r |= sum
      AND a, b, @t2              ; Formula: carry = (a & b) | (carry & (a ^ b))
      AND carry, @t1, @t1        ;
      OR @t2, @t1, carry         ; The carry is calculated. Its left shifted copy is in S. 
      MOVE S, carry              ; Assign the carry to itself but shifted the next bit.
      MOVE mask, mask, mask      ; Dummy assignment to just get: S = mask << 1.
      MOVE S, mask               ; mask = S = mask << 1

Then we implement the 16-bit adder:

    ; Input:
    ;  a, b  - argument
    ;  carry ñ a carry (the least significant bit only makes sense)
    ; Output:
    ;  r     - the result: r = a + c + carry
    ;  carry ñ a carry (the least significant bit only makes sense)
    ;
    ; Variables having '@' prefix are local for the macro.
    ; const_1 - a special location containing the constant 0x0001.
    ;
    !macro ADC a, b, carry, r
      XOR r, r, r                     ; r = 0.
      MOVE const_1, @mask             ; The initial mask value = 0x0001
      *16 FADD @mask, carry, a, b, r  ; Repeat FADD 16 times (no loops, just a
                                      ; repetition)
      AND carry, const_1, carry       ; Clean-up all bits in carry except LSB.

What happens in `ADC`? On each iteration (repetition) of `FADD` it sums the current bit (its mask is `@mask`). Then the sum is joined (via `OR`) with the result. The mask is shifted to left 1 bit (the `@mask` takes values 0x0001 -> 0x0002 -> 0x0004 etc). The carry is also shifted to the left 1 bit to be used on the next iteration of `FADD`. After 16 iterations the carry will be in LSB (because the interpreter shifts cyclically). The carry after 16 iterations will be output value of carry.

The addition is implemented eventually. Then we could programmatically implement a subroutine stack. `CALL`/`RET` instructions could be based on the stack mechanism and branching instructions.

Now we can easily do any computations on our pseudo CPU executing only one command.

What's the point of all this stuff? First of all is an academic interest, fun.

Related posts:

* [Swap two numeric variables using XOR][]

[Swap two numeric variables using XOR]: /blog/english/2010/03/17/swap-two-numeric-variable-using-xor/
