---
layout: post
title: "One-command NORCPU program hacking challenge: analysis and solutions"
language: english
date: 2011-02-16 00:00
comments: true
blogspot: http://meta-coding.blogspot.com/2011/02/one-command-norcpu-program-hacking.html
categories: 
- norcpu
- project
- english
---
Publishing the [announcement of the problem to hack][NORCPU hackme challenge] a program running on the CPU executing just one single command, I hoped to get a solution to the end of March, not earlier.

Note: Quoted materials below are provided "as is" in the original author edition. Only minor formatting changes are applied. Of course, the texts on Russian are translated to English.

But the reality was different. Literally a few hours after the announcement, I received an e-mail from **Vasiliy Artemev**.

> Secret code: 139471

That was the correct answer. Vasiliy was a winner and received the 100$ prize. He kindly shared that he bruteforced the problem. In fact, a simple bruteforce attach forced the program printing out the magic message even on a 3-character attempt. Alas, my hash function used to check the password had many collisions and become a weak link.

But there was no complete analysis of the password checking algorithm, and Vasiliy offered to sponsor the rest of the challenge to figure out the algorithm with 50$ from his prize. The challenge kept going.

In meanwhile I wrote the [second version of the problem][Problem 2] without hashing but just an encrypted password. I hoped this makes the analysis harder. But in the same day evening I received an e-mail from **Anton Bukov**:

> Answer for NORCPU hackme challenge, Version 2: "R0und2 D0ne!" ?

It was the correct one. I wondered how is it possible to figure out so quickly?

Anton also shared his approach.

> My hack is based on the line:

    mem = mem_0.slice(0);

> An array gets copied here, and if you call `calc()` function twice on the same array, then for any incorrect password it will print out the answer. In code it looked as:

    wcout << calc(L"0") << endl << calc(L"0") << endl;

> I guess that copying was used to prevent it. I'm afraid this is not the way you expected. Even I was surprised when got the answer in the output. Afterwards I figured out where it appeared from.

Accidentally Anton discovered a bug causing the program itself to reveal the secret, again. It needed just to run the interpreter twice without resetting memory.

The root of the problem:

{% codeblock lang:nasm %}
...
  IS_0(flag)
  JZ okay
  EXIT(1)
okay:
  ; print the secret
  ...
{% endcodeblock %}

After the first wrong run and refusing to print out the secret the program has stopped at the line 4, the `ip` register points to the `okay` label. If the interpreter gets started again without resetting memory (all registers including `ip` reside in memory), it keeps executing right from the `okay` and prints out the secret.

It was a shame. I fixed the problem quickly and released the version 2.1 without this side effect.

A couple of days left.

I received an e-mail from a guy with **a5b** nickname.

> Hot-patch of branching and the answer pw: `abcd` resp: `R0und2 D0ne!`
>
> * the password, obviously, is incorrect
> * inverted data being written to `(i == 27692 i==31712)`

Formally, this is the solution, but there is no password which means the algorithm is not analysed so far.

But after an hour I received an addendum:

    h1cKmE1fUsAn
    
    input data:
    chr conI LEET xor
    CHR1 13417 13313 104 h
    CHR2 39953 39968 49 1
    CHR3 54302 54397 99 c
    CHR4 32223 32148 75 K
    CHR5 30900 30937 109 m
    CHR6 27373 27304 69 E
    CHR7 16420 16405 49 1
    CHR8 49210 49244 102 f
    CHR9 16740 16689 85 U
    CHR10 50115 50096 115 s
    CHR11 19308 19245 65 A
    CHR12 57802 57764 110 n
    
    static init:
    CHRi 59609= 59651
    CONi 59610= 59634
    CNTR 59611=12
    SUM 59608=0
    LEET 59607 = 13313
    
    1:
    [59609]+1 -> [59609] // select next chr
    [59610]+1 -> [59610] // select next con
    
    SUM |= CHRi ^ LEET ^ CONi
    LEET = LEET * 3 + 29
    
    [59611]: if([59611] != 0) Loop 1
    
    ...
    if(SUM != 0) exit
    else print R0und2 D0ne // haven't analysed this part.
    // Based on the code modifications (moving the index), it loads 12 constants:
    // 29528 22899 2971 9089 27542 17353 52278 25635 11626 34909 39131 51838,
    // deals with each one and prints out.
    
This is the solution now. **a5b** became the first one who sent the algorithm of the [problem 2][Problem 2].

In the same evening I received a solution from **Max Filippov**.

> Algorithm that was used to check password correctness in the first round was the following:

{% codeblock lang:cpp %}
bool check(const char *p)
{
   int v = 0x1040;

   for(; *p; ++p)
   {
       v ^= *p;
       for (int i = 0; i < 8; ++i)
       {
           int f = v & 1;
           v >>= 1;
           if (f)
               v ^= 0x1408;
       }
   }
   return v == 0x1c89;
}
{% endcodeblock %}

> that is, sort of CRC.
> 
> To discover it I've collected NORCPU execution trace and "disassembled" it.
>
> Modified NORCPU source and disassembler are attached, and also may be found [there][Max Filippov solution].

[Max Filippov solution]: http://jcmvbkbc.spb.ru/git/?p=dumb/norcpu.git;a=summary

And a little add-on:

> The method used is pretty straightforward:
>
> * collect execution trace;
> * recognize instruction patterns and collapse sequences of primitive instructions to more complex ones;
> * analyze disassembled trace.
>
> So, first I needed trace: I copied javascript text into cpp source, fixed lingual differences and inserted the following printf:

{% codeblock lang:cpp %}
while (1) {
  int i = mem[ip];
  printf("%04x:NOR(%04x, %04x => %04x) ", i, mem[i], mem[i + 1], mem[i + 2]);
  int a = mem[i + 0];
{% endcodeblock %}

> so that I got a long line (about 8Mb) of primitive instruction execution trace.
> 
> Then I started constructing sed script that would make it readable.
> 
> First, it broke the trace linewise, one instruction per line (288323 lines, will read it in case of insomnia). I took a look at processed trace and recorded several obvious instruction patterns into sed. Then reran script, took next look, recorded more patterns, ...
> 
> This way I figured out all boolean logic commands and jumps. Then rotations left. Each time new command got recognized, new filtered processed trace was suggesting next step, e.g. 15 ROTL equals ROTR etc.
> 
> Then I looked into [your article][Modelling a CPU with only one operation]. And found addition pattern in disassembly. And recorded it in sed script.
>
> After that I was able to just read the trace (which shrink to 1035 lines). Its inner loop fit into one page, I just made some notes on a scratchpad:

[Modelling a CPU with only one operation]: /blog/english/2010/04/06/modelling-a-cpu-with-only-one-operation/

    [f1ba]: current in-T index (i)
    [f1b4]: LEN
    [f1b5]: 8

    0012-0035:[f1b9] ^= (T[i] & 0xff)

    006d-007b:[f1b8] = [f1b9] & 1
    008a-0158:[f1b9] >>= 1
    0167-10c7:[f1aa] = [f1b8] + -1, [f1ab] = !carry
    10ca-10e6:jmp on carry to 1145:110d

    110d-111b:[f1b9] ^= 1408

    1145-1f4f:--[f1b5]
    20a5-3005:[f1aa] = [f1b5] + -1, f1ab = !carry
    3008-3024:jmp on carry to 006d:304b

    304b-304b:++i
    3fab-3fab:--LEN
    4f0b-5e8a:jmp on carry to 5eb1:6

> then I browsed through the repetitions of this inner loop and found the end of the outer loop.

    5eb1-6e74:check 1c89

> Then just translated it into C. It all took me three evenings.

Then Max Filippov sent the solution for the [problem 2][Problem 2].

> The second problem answer -- `h1cKmE1fUsAn`
> 
> The result -- `R0und2 D0ne!`
> 
> The password check algorithm is:

{% codeblock lang:cpp %}
bool check(const char *p)
{
   static const int xor_array[] = {
       0x3469,
       0x9c11,
       0xd41e,
       0x7ddf,
       0x78b4,
       0x6aed,
       0x4024,
       0xc03a,
       0x4164,
       0xc3c3,
       0x4b6c,
       0xe1ca,
   };

   int v = 0;
   int x = 0x3401;

   for (int i = 0; i < 12; ++i)
   {
       int f = p[i] ^ x ^ xor_array[i];
       // printf("x: %04x, f: %04x\n", x, f);
       v |= f;
       x = (x * 3 + 0x1d) & 0xffff;
   }
   return !v;
}
{% endcodeblock %}

> The commented printf prints out the secret phrase on-the-fly.
> 
> The method of analysis -- similar to the first problem -- disassembling of the trace.
> 
> The first round was frankly more interestintg.

And, finally, the last solution of the [first problem][Problem] is received from **Salo Kril**.

No comments -- just sources.

{% codeblock lang:cpp %}
// Password generation.

// Brute_force(3);

WORD ks_f(char *buff, int len)
{
   int i, j;
   WORD ks = 0x1040;

   for (i = 0; i < len; i++)
   {
       ks ^= buff[i];
       for (j = 0; j < 8; j++)
       {
           if((ks & 1) == 0)
               ks = ks >> 1;
           else
               ks = (ks >> 1) ^ 0x1408;
       }
   }
   return ks;
}

void Brute_force(int n)
{
   int i;
   static char alphabet[] =
       "\x20\x21\x22\x23\x24\x25\x26\x27\x28\x29\x2A\x2B\x2C\x2D\x2E\x2F"
       "\x30\x31\x32\x33\x34\x35\x36\x37\x38\x39\x3A\x3B\x3C\x3D\x3E\x3F"
       "\x40\x41\x42\x43\x44\x45\x46\x47\x48\x49\x4A\x4B\x4C\x4D\x4E\x4F"
       "\x50\x51\x52\x53\x54\x55\x56\x57\x58\x59\x5A\x5B\x5C\x5D\x5E\x5F"
       "\x60\x61\x62\x63\x64\x65\x66\x67\x68\x69\x6A\x6B\x6C\x6D\x6E\x6F"
       "\x70\x71\x72\x73\x74\x75\x76\x77\x78\x79\x7A\x7B\x7C\x7D\x7E";

   if(n == 0)
   {
       if(ks_f(buff_bf, BF_N) == 0x1c89)
           printf("%s\n",buff_bf);
       return;
   }

   n--;
   for (i = 0; alphabet[i]; i++)
   {
       buff_bf[n] = alphabet[i];
       Brute_force(n);
   }
}
{% endcodeblock %}

and re-constructed code:

{% codeblock lang:cpp %}
#define DEST_COUNT  0xF1FE
extern WORD mem[];

/*
    Secret code: 139471
*/
void reconstructed_fn(void)
{
    int i, j;
    WORD src, dest, key, count, hash, hash_OK, key_const;

    src = mem[0xF1BA];     // input string
    count = mem[0xF1ED];   // input string length
    dest = mem[0xF1BB];    // 0xf1ff
    hash_OK = mem[0xF1BC]; // 0x1c89
    hash = mem[0xF1B9];    // 0x1040


    for(i = 0; i < count; i++)
    {
        hash ^= mem[src + i] & 0xFF;

        for (j = 0; j < 8; j++)
        {
            if ((hash & 1) == 0)
                hash = hash >> 1;
            else
                hash = (hash >> 1) ^ 0x1408;
        }
    }

    if (hash == hash_OK)
    {
        src = mem[0x6EB6];              // "Secret code: 139471"
        count = mem[0xF1C7];            // 19
        key = ((hash >> 8) ^ hash) + 1;
        key_const = mem[0x6EA8];        // 11
    }
    else
    {
        src = mem[0x5EBE];          // "Wrong password!"
        count = mem[0xF1DC];        // 15
        key = mem[0xF1BD];
        key_const = mem[0xF1BE];    // 17
    }

    mem[DEST_COUNT] = count;
    for (i = 0; i < count; i++)
    {
        mem[dest + i] = mem[src + i] ^ key;
        key = key * 3 + key_const;
    }
}

/*
--------------------------------------------------------------------------------------------
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
--------------------------------------------------------------------------------------------
*/
WORD and(WORD w1, WORD w2)
{
    return w1 & w2;
}

WORD or(WORD w1, WORD w2)
{
    return w1 | w2;
}

WORD xor(WORD w1, WORD w2)
{
    return w1 ^ w2;
}

WORD rol(WORD w1, WORD n)
{
    return (w1 << n) | (w1 >> (16 - n));
}

WORD ror(WORD w1, WORD n)
{
    return (w1 >> n) | (w1 << (16 - n));
}
WORD extend_16(WORD k1)
{
    int i, k2;

    for (i = 0, k2 = 0; i < 16; i++)
    {
        k2 = or(k2, k1);
        k1 = rol(k1, 1);
    }

    return k2;
}

WORD add(WORD *kk1, WORD a, WORD b)
{
    WORD mask_bit, aa0, aa1, tmp1, i, k1, k2;
    k1 = 0;
    k2 = 0;
    mask_bit = 1;

    for (i = 0; i < 16; i++)
    {
        k1 = and(k1, mask_bit);
        aa0 = xor(a, b);
        tmp1 = xor(aa0, k1);
        tmp1 = and(tmp1, mask_bit);
        k2 = or(tmp1, k2);
        aa1 = and(a, b);
        aa0 = and(k1, aa0);
        k1 = or(aa1, aa0);
        k1 = rol(k1, 1);
        mask_bit = rol(mask_bit, 1);
    }
    k1 = and(k1, mask_bit);
    *kk1 = extend_16(k1);

    return k2;
}

void reconstr(void)
{
    WORD k1, k2, src, dest, tmp1, key, count, tmp2, tmp3, i, ks, ks_OK, key_a;
    WORD mask_bit, aa1, aa0;

    k1 = mem[0xF1AF];    // 0x88
    k2 = mem[0xF1A3];    // 0x47
    src = mem[0xF1BA];   // input string
    count = mem[0xF1ED]; // input string length
    dest = mem[0xF1BB];  // 0xf1ff
    ks_OK = mem[0xF1BC]; // 0x1c89             "w":ks=0x0ACC   "WWW":0x0FCE   "123456789":ks=0x05E3
    ks = mem[0xF1B9];    // 0x1040


l_0006:
    ks = xor(ks, and(mem[src], 0xFF));
    i = 8;

l_006D:
    tmp3 = and(ks, 1);
    ks = ror(ks, 1);
    ks = and(ks, 0x7FFF);
    tmp2 = add(&k2, tmp3, -1);
    if(k2 != 0)
    {
        ks = xor(ks, 0x1408);
    }

l_1145:
    i = add(&k1, i, -1);
    tmp2 = add(&k2, i, -1);
    if(k2 != 0)
        goto l_006D;

l_304B:
    src = add(&k1, src, 1);
    count = add(&k1, count, -1);
    tmp2 = add(&k2, count, -1);
    if(k2 != 0)
        goto l_0006;


    src = mem[0x5EBE];    // Wrong password!
    count = mem[0xF1DC];  // 15
    key = mem[0xF1BD];
    key_a = mem[0xF1BE];
    ks_OK = xor(ks_OK, ks);
    tmp2 = add(&k2, ks_OK, -1);

    if(k2 != 0)
        goto l_8552;

l_6E9B:
    src = mem[0x6EB6];     // Secret code: 139471
    count = mem[0xF1C7];   // 19
    key = ks;
    key_a = mem[0x6EA8];

    key = ror(key, 8);
    key = and(key, 0xFF);
    key = xor(ks, key);
    key = and(key, 0x7FFF);
    key = add(&k1, key, 1);


l_8552:
    mem[DEST_COUNT] = count;
l_8558:
    mem[dest] = xor(mem[src], key);
    tmp3 = add(&k1, key, key);
    key = add(&k1, key, tmp3);
    key = add(&k1, key, key_a);
    src = add(&k1, src, 1);
    dest = add(&k1, dest, 1);
    count = add(&k1, count, -1);
    tmp2 = add(&k2, count, -1);
    if(k2 != 0)
        goto l_8558;

l_F186:
    mem[0xF1B2] = mem[0xF193]; // nc
}
{% endcodeblock %}

Well, as you understand the solutions have been fully comprehensive.

Thanks to all participants.

I'm putting the original sources below. Just run the Python script to compile the code written on the function-macros, to run through and to generate an html-page ("template.html" is required).

All the sources are available on as a git [repository][Solution repository].

## Problem 1

File [norcpu.py][norcpu.py v1] ([template.html][template.html v1]):

[norcpu.py v1]: https://github.com/begoon/norcpu/blob/master/v1/norcpu.py
[template.html v1]: https://github.com/begoon/norcpu/blob/master/v1/template.html

{% codeblock lang:python %}
import sys, re, time, string, binascii

verbose = False
verbose_cpu = False
scramble = True

test_wrong_crc = 0

secret_code = "Secret code: 139471"
password = "h0cKmE1fUsAn"
guess    = "123456789012"
guess    = password

# Secret code message encryption mask.
secret_coef_add = 17

message_text = "Wrong password!"
# Wrong password message encryption mask.
message_mask = 0x6301
message_coef_add = 11

# Non-standard CRC initial value (should be 0xFFFF).
crc16_initial_value = 0x1040

# Non-standard CRC constant (should be 0x8401).
crc16_constant = 0x1408

code_segment = []
data_segment = []

label_count = 0

def dump(data, length = 8):
  result = []
  for i in xrange(0, len(data), length):
    line = data[i:i + length]
    hex_line = ' '.join(["%04X" % x for x in line])
    result.append("%04X: %-*s\n" % (i, length*5, hex_line))
  return ''.join(result)

def dump_js(data, length = 8):
  result = []
  for i in xrange(0, len(data), length):
    line = data[i:i + length]
    hex_line = ' '.join(["0x%04X," % x for x in line])
    result.append("%-*s\n" % (length*5, hex_line))
  return ''.join(result)

def calc_crc16(data):
  global crc16_initial_value
  global crc16_constant

  crc16 = crc16_initial_value
  for i in range(0, len(data)):
    ch = ord(data[i]) & 0xff
    crc16 = crc16 ^ ch
    for j in range(0, 8):
      if ((crc16 & 1) != 0):
        crc16 = (crc16 >> 1) ^ crc16_constant
      else:
        crc16 = crc16 >> 1
  return crc16

crc16 = calc_crc16(password)

def encode_string(data, name, mask, coef_add):
  global mem, names
  offset = names[name]
  offset_sz = names[name + "_sz"]
  for i in range(0, len(data)):
    mem[offset + i] = ord(data[i]) ^ mask
    mask = (mask * 3 + coef_add) & 0xffff
  mem[offset_sz] = len(data)

def put_string(data, name):
  global mem, names
  offset = names[name]
  offset_sz = names[name + "_sz"]
  for i in range(0, len(data)):
    mem[offset + i] = ord(data[i])
  mem[offset_sz] = len(data)

def save_mem(name, size = -1):
  f = open(name, "w")
  if size == -1: size = len(mem)
  for i in (mem[0:size]):
    hex = "%04X" % i
    bin = binascii.a2b_hex(hex)
    f.write(bin)
  f.close()

def next_label():
  global label_count
  label_count = label_count + 1
  return "label_%04d" % label_count

def code_rem(comment):
  code_segment.append('; ' + comment)

def data_rem(comment):
  data_segment.append('; ' + comment)

def data_label(name):
  data_segment.append(name + ":")

def code_label(name):
  code_segment.append(name + ":")

def code(value):
  printed = value
  if type(value).__name__ == 'int':
    printed = "%d" % value
  code_segment.append("  dw %s" % printed)

scramble_counter = 0x27

def next_scramble_counter():
  global scramble_counter
  scramble_counter = scramble_counter * 3 + 7
  return scramble_counter & 0xff

def word(value):
  if value == -1:
    if scramble:
      value = next_scramble_counter()
    else:
      value = 0
  printed = value
  if type(value).__name__ == 'int':
    printed = "%d" % value
  data_segment.append("  dw %s" % printed)

def buffer(length, value = -1):
  for i in range(0, length):
    word(value)

def var(name, value = -1):
  data_label(name);
  word(value);

def NOR(a, b, r):
  code_rem('NOR ' + str(a) + ' ' + str(b) + ' ' + str(r))
  code(a)
  code(b)
  code(r)

def NOT(a, r):
  NOR(a, a, r);

def OR(a, b, r):
  NOR(a, b, "or_reg")
  NOT("or_reg", r)
var("or_reg")

def AND(a, b, r):
  NOT(a, "and_reg_a")
  NOT(b, "and_reg_b")
  OR("and_reg_a", "and_reg_b", "and_reg_a")
  NOT("and_reg_a", r)
var("and_reg_a")
var("and_reg_b")

def ANDi(a, imm, r):
  MOVi(imm, "and_i_reg")
  AND(a, "and_i_reg", r)
var("and_i_reg")

def XOR(a, b, r):
  NOT(a, "xor_reg_a")
  NOT(b, "xor_reg_b")
  AND(a, "xor_reg_b", "xor_reg_b")
  AND(b, "xor_reg_a", "xor_reg_a")
  OR("xor_reg_a", "xor_reg_b", r)
var("xor_reg_a")
var("xor_reg_b")

def XORi(a, imm, r):
  MOVi(imm, "xor_i_reg")
  XOR(a, "xor_i_reg", r)
var("xor_i_reg")

def MOV(a, b):
  code_rem('MOV ' + str(a) + ' ' + str(b))
  NOT(a, "move_reg")
  NOT("move_reg", b)
  code_rem('MOV END')
var("move_reg")

def JMP(a):
  code_rem('JMP ' + str(a))
  MOV(a, "ip")

def JMPi(a):
  code_rem('JMPi ' + str(a))
  label = next_label()
  JMP(label)
  code_label(label)
  code(a)

def MOVi(imm, a):
  code_rem('MOVi #' + str(imm) + ' ' + str(a))
  label_data = next_label()
  label_jump = next_label()
  MOV(label_data, a)
  JMPi(label_jump)
  code_label(label_data)
  code(imm)
  code_label(label_jump)

# [a] -> b
def PEEK(a, b):
  label1 = next_label()
  label2 = next_label()
  MOV(a, label1)
  MOV(a, label2)
  code_label(label1)  # NOT(0, 0, move_reg)
  code(0)             # <- a
  code_label(label2)  #
  code(0)             # <- a
  code("move_reg")    #
  NOT("move_reg", b)

# a -> [b]
def POKE(a, b):
  code_rem('POKE ' + str(a) + ' [' + str(b) + ']')
  label = next_label()
  MOV(b, label)
  NOT(a, "move_reg")  # +3 (three operations)
  code("move_reg")    # +4
  code("move_reg")    # +5
  code_label(label)
  code(0)             # <- b

# imm -> [a]
def POKEi(imm, a):
  MOVi(imm, "poke_i_reg")
  POKE("poke_i_reg", a)
var("poke_i_reg")

def EXIT(a):
  MOV(a, "exit_reg")

def EXITi(a):
  MOVi(a, "exit_reg")

def FADD(mask, carry, a, b, r):
  AND(a, mask, "fadd_reg_a")  # zero bits in 'a' except mask'ed
  AND(b, mask, "fadd_reg_b")  # zero bits in 'b' except mask'ed
  AND(carry, mask, carry)     # zero bits in 'carry' except mask'ed

  # SUM = (a ^ b) ^ carry
  XOR(a, b, "fadd_reg_t1")
  XOR("fadd_reg_t1", carry, "fadd_reg_bit_r")

  # Leave only 'mask'ed bit in bit_r.
  AND("fadd_reg_bit_r", mask, "fadd_reg_bit_r")

  # Add current added bit to the result.
  OR("fadd_reg_bit_r", r, r)

  # CARRY = (a & b) | (carry & (a ^ b))
  AND(a, b, "fadd_reg_t2")
  AND(carry, "fadd_reg_t1", "fadd_reg_t1")

  # CARRY is calculated, and 'shift_reg' contains the same value
  # but shifted the left by 1 bit.
  OR("fadd_reg_t2", "fadd_reg_t1", carry)

  # CARRY is shifted the left by 1 bit to be used on the next round.
  MOV("shift_reg", carry)

  # shift_reg = mask << 1
  MOV(mask, mask)
  # mask = shift (effectively "mask = mask << 1")
  MOV("shift_reg", mask)

  AND(carry, mask, carry)

var("fadd_reg_a")
var("fadd_reg_b")
var("fadd_reg_bit_r")
var("fadd_reg_t1")
var("fadd_reg_t2")

def ZERO(a):
  XOR(a, a, a)

def FADC(a, b, r):
  ZERO("fadc_reg_t")
  MOV("const_1", "fadc_reg_mask")
  for i in range(0, 16):
    FADD("fadc_reg_mask", "carry_reg", a, b, "fadc_reg_t")
  MOV("fadc_reg_t", r)

  ZERO("fadc_reg_t")

  for i in range(0, 16):
    OR("fadc_reg_t", "carry_reg", "fadc_reg_t")
    MOV("carry_reg", "carry_reg")
    MOV("shift_reg", "carry_reg")

  MOV("fadc_reg_t", "carry_reg")

var("fadc_reg_mask")
var("fadc_reg_t")

def ADD(a, b, r):
  ZERO("carry_reg")
  FADC(a, b, r)

def ADDi(a, imm, r):
  MOVi(imm, "add_i_reg")
  ADD(a, "add_i_reg", r)
var("add_i_reg")

def PUSH(a):
  ADD("stack_reg", "const_minus_1", "stack_reg")
  POKE(a, "stack_reg")

def PUSHi(imm):
  MOVi(imm, "push_i_reg")
  PUSH("push_i_reg")
var("push_i_reg")

def POP(a):
  PEEK("stack_reg", a)
  ADD("stack_reg", "const_1", "stack_reg")

def CALL(a):
  label = next_label()
  PUSHi(label)
  JMP(a)
  code_label(label)

def CALLi(a):
  label = next_label()
  PUSHi(label)
  JMPi(a)
  code_label(label)

def RET():
  POP("ip")

# Jump 'a', if cond = FFFF, and 'b' if conf = 0000
def BRANCH(a, b, cond):
  AND(a, cond, "branch_reg_a")              # reg_a = a & cond
  NOT(cond, "branch_reg_b")                 # reg_b = !cond
  AND(b, "branch_reg_b", "branch_reg_b")    # reg_b = b & reg_b = b & !cond
  OR("branch_reg_a", "branch_reg_b", "ip")  # ip = (a & cond) | (b & !cond)
var("branch_reg_a")
var("branch_reg_b")

# Jump 'a', if cond = FFFF, and 'b' if conf = 0000
def BRANCHi(a, b, cond):
  MOVi(a, "branch_i_reg_a")
  MOVi(b, "branch_i_reg_b")
  BRANCH("branch_i_reg_a", "branch_i_reg_b", cond)
var("branch_i_reg_a")
var("branch_i_reg_b")

# if a != 0 -> carry = FFFF else carry = 0000
def IS_0(a):
  ZERO("carry_reg")
  FADC(a, "const_minus_1", "is_0_reg")
  NOT("carry_reg", "zero_reg")
var("is_0_reg")
var("zero_reg")

# ip = (zero_reg == FFFF ? a : ip)
def JZi(a):
  label = next_label()
  BRANCHi(a, label, "zero_reg")
  code_label(label)

# ip = (zero_reg == FFFF ? a : ip)
def JNZi(a):
  label = next_label()
  BRANCHi(label, a, "zero_reg")
  code_label(label)

def ROL(a, b):
  MOV(a, a)            # shift_reg = a << 1
  MOV("shift_reg", b)

def ROR(a, b):
  MOV(a, "ror_reg")
  for i in range(0, 15):
    ROL("ror_reg", "ror_reg")
  MOV("ror_reg", b)
var("ror_reg")

def SHL(a, b):
  ROL(a, b)
  ANDi(b, 0x0001, b)

def SHR(a, b):
  ROR(a, b)
  ANDi(b, 0x7FFF, b)

# NORCPU code

var("ip", "start")
var("shift_reg")
var("carry_reg")
var("const_1", 1)
var("const_minus_1", 0xFFFF)
var("exit_reg")

var("stack_reg", "stack")

code_label("start")

var("i")
var("j")
var("ch")
var("mask")
var("t")

var("crc16", crc16_initial_value)

var("ptr", "password")
MOV("password_sz", "i")

crc_loop = next_label()
code_label(crc_loop)          # crc_loop
# ch = *ptr
PEEK("ptr", "ch")
# ch &= 0xFF
ANDi("ch", 0xFF, "ch")
# crc16 ^= ch
XOR("crc16", "ch", "crc16")

MOVi(8, "j")
crc_loop_j = next_label()
code_label(crc_loop_j)        # crc_loop_j

# t = crc16 & 1
ANDi("crc16", 1, "t")
# crc16 >>= 1
SHR("crc16", "crc16")
IS_0("t")
crc_loop_1 = next_label()
JZi(crc_loop_1)
# crc16 ^= crc16_constant
XORi("crc16", crc16_constant, "crc16")
code_label(crc_loop_1)        # crc_loop_1

ADD("j", "const_minus_1", "j")
IS_0("j")
JNZi(crc_loop_j)

# ptr += 1
ADD("ptr", "const_1", "ptr")
# i = i - 1
ADD("i", "const_minus_1", "i")
IS_0("i")
JNZi(crc_loop)

var("ptr2", "result")

correct_crc = crc16 + test_wrong_crc

var("correct_crc", correct_crc)

# By default we're going to decrypt 'Wrong...' message.
MOVi("message", "ptr")
MOV("message_sz", "i")

var("message_mask", message_mask)
MOV("message_mask", "mask")

var("coef_add", message_coef_add)

wrong_label = next_label()

XOR("correct_crc", "crc16", "correct_crc")
IS_0("correct_crc")
JNZi(wrong_label)

# Now we switch to descrypt the secret message.
MOVi(secret_coef_add, "coef_add")

MOVi("secret", "ptr")
MOV("secret_sz", "i")

# mask = ((crc16 & 0xff) | ((crc16 >> 8) & 0xff)) + 1
MOV("crc16", "mask")
for i in range(0, 8):
  SHR("mask", "mask")
XOR("crc16", "mask", "mask")
ANDi("mask", 0xff, "mask")

ADD("mask", "const_1", "mask")

code_label(wrong_label)

MOV("i", "result_sz")

loop = next_label()
code_label(loop)              # loop
# ch = *ptr
PEEK("ptr", "ch")
# ch ^= mask
XOR("ch", "mask", "ch")
POKE("ch", "ptr2")
# mask = mask * 3 + 11
ADD("mask", "mask", "t")
ADD("mask", "t", "mask")
ADD("mask", "coef_add", "mask")
# ptr += 1
ADD("ptr", "const_1", "ptr")
# ptr2 += 1
ADD("ptr2", "const_1", "ptr2")
# i = i - 1
ADD("i", "const_minus_1", "i")
IS_0("i")
JNZi(loop)

EXITi(0x00)

buffer(8)
data_label("stack")

var("secret_sz", len(secret_code))
data_label("secret")
buffer(len(secret_code) + 1)

var("message_sz")
data_label("message")
buffer(16)

var("password_sz")
data_label("password")
buffer(16)

# The buffer holding the result string.
var("result_sz")
data_label("result")
buffer(32)

# Compiler

text = code_segment
text.extend(data_segment)

if verbose:
  print "\n".join(text)

# Phase 1. Calculate names.

addr = 0
names = {}
for line in text:
  if line[0] == ';': continue
  if line[0] != ' ':
    name = line.partition(':')[0]
    names[name] = addr
  else:
    addr = addr + 1

if verbose:
  print names

raw_text = "\n".join(text)

# Resolve names.

for name in names:
  if verbose:
    print name, names[name], type(names[name])
  name_re = re.compile(r'dw ' + name + '$', re.M)
  value = "%d" % names[name]
  raw_text = name_re.sub('dw ' + value, raw_text)

text = raw_text.split("\n")

if verbose:
  print "\n".join(text)

# Phase 2. Compilation.

addr = 0
comment = ""
mem = []
for line in text:
  if line[0] == ';' or line[0] != ' ':
    comment = comment + line + ' '
  else:
    value = int(line.strip().partition(" ")[2])
    if verbose:
      print "%04X: %04X ; %s" % (addr, value, comment)
    mem.append(value)
    addr = addr + 1
    comment = ""

# Interpretation

ip = names["ip"]
exit_reg = names["exit_reg"]
shift_reg = names["shift_reg"]
carry_reg = names["carry_reg"]

def nor(a, b):
  r = a | b
  r = r ^ 0xFFFF
  return r & 0xFFFF

def norcpu():
  while 1:
    i = mem[ip];
    a = mem[i + 0]
    b = mem[i + 1]
    r = mem[i + 2]
    mem[ip] = i + 3
    f = nor(mem[a], mem[b])
    mem[r] = f
    mem[shift_reg] = ((f >> 15) & 1) | ((f & 0x7FFF) << 1)

    if verbose_cpu:
      print "%04X: %04X [%04X] %04X [%04X] -> %04X [%04X]" % \
            (i, a, mem[a], b, mem[b], r, mem[r])
    if r == exit_reg:
      break

print "Starting from [%04X]" % mem[ip]

# Encrypt the secret code.
secret_mask = ((crc16 & 0xff) ^ ((crc16 >> 8) & 0xff)) + 1
encode_string(secret_code, "secret", secret_mask, secret_coef_add);

# Encrypt 'Wrong...' message.
encode_string(message_text, "message", message_mask, message_coef_add);

mem_js = dump_js(mem)
save_mem("norcpu-1-before.bin")
mem_sz = len(mem)

if len(mem) >= 0x10000:
  print "Too much code (%08X, %04X)" % (len(mem), len(mem) - 0x10000)
  sys.exit()

# Inject plain password in the last moment (for testing).
put_string(guess, "password")

save_mem("norcpu-2-before-with-password.bin")

if verbose:
  print "Original memory:"
  print dump(mem)

start_time = time.time()

norcpu()

end_time = time.time()

save_mem("norcpu-3-after.bin", mem_sz)

if verbose:
  print "Memory after:"
  dump(mem)

print
print "Size: %X" % len(mem)
print "Time: %d" % (end_time - start_time)
print "Exit: %04X" % mem[exit_reg]

print("CRC : %04X (%04X)" % (crc16, correct_crc))

result = names["result"]
result_value = ""
for i in range(0, mem[names["result_sz"]]):
  result_value = result_value + chr(mem[result + i] & 0xff)

if result_value != secret_code:
  print "ERROR: [%s] != [%s]" % (secret_code, result_value)

js = string.Template(open('template.html', 'r').read())

js = js.substitute( \
  ip = names["ip"],
  exit_reg = names["exit_reg"],
  shift_reg = names["shift_reg"],
  password = names["password"],
  password_sz = names["password_sz"],
  result = names["result"],
  result_sz = names["result_sz"],
  mem_js = mem_js
)

f = open("norcpu.html", "w")
f.write(js)
f.close()
{% endcodeblock %}

## Problem 2

File [norcpu.py][norcpu.py v2] ([template.html][template.html v2]):

[norcpu.py v2]: https://github.com/begoon/norcpu/blob/master/v2/norcpu.py
[template.html v2]: https://github.com/begoon/norcpu/blob/master/v2/template.html

{% codeblock lang:cpp %}
import sys, re, time, string, binascii

verbose = False
verbose_cpu = False
scramble = True

secret_password = "h1cKmE1fUsAn"
secret_password_xor_mask = 0x3401
secret_password_add = 29

secret_code = "R0und2 D0ne!"
secret_code_xor_mask = 0x730A
secret_code_add = 37

guess = "123456789012"
guess = secret_password

code_segment = []
data_segment = []

label_count = 0

def dump(data, length = 8):
  result = []
  for i in xrange(0, len(data), length):
    line = data[i:i + length]
    hex_line = ' '.join(["%04X" % x for x in line])
    result.append("%04X: %-*s\n" % (i, length*5, hex_line))
  return ''.join(result)

def dump_js(data, length = 8):
  result = []
  for i in xrange(0, len(data), length):
    line = data[i:i + length]
    hex_line = ' '.join(["0x%04X," % x for x in line])
    result.append("%-*s\n" % (length*5, hex_line))
  return ''.join(result)

def encode_string(data, name, mask, coef_add):
  global mem, names
  offset = names[name]
  offset_sz = names[name + "_sz"]
  for i in range(0, len(data)):
    mem[offset + i] = ord(data[i]) ^ mask
    mask = (mask * 3 + coef_add) & 0xffff
  mem[offset_sz] = len(data)

def put_string(data, name):
  global mem, names
  offset = names[name]
  offset_sz = names[name + "_sz"]
  for i in range(0, len(data)):
    mem[offset + i] = ord(data[i])
  mem[offset_sz] = len(data)

def save_mem(name, size = -1):
  f = open(name, "w")
  if size == -1: size = len(mem)
  for i in (mem[0:size]):
    hex = "%04X" % i
    bin = binascii.a2b_hex(hex)
    f.write(bin)
  f.close()

def next_label():
  global label_count
  label_count = label_count + 1
  return "label_%04d" % label_count

def code_rem(comment):
  code_segment.append('; ' + comment)

def data_rem(comment):
  data_segment.append('; ' + comment)

def data_label(name):
  data_segment.append(name + ":")

def code_label(name):
  code_segment.append(name + ":")

def code(value):
  printed = value
  if type(value).__name__ == 'int':
    printed = "%d" % value
  code_segment.append("  dw %s" % printed)

scramble_counter = 0x2743

def next_scramble_counter():
  global scramble_counter
  scramble_counter = scramble_counter * 3 + 7
  return scramble_counter & 0xffff

def word(value):
  if value == -1:
    if scramble:
      value = next_scramble_counter()
    else:
      value = 0
  printed = value
  if type(value).__name__ == 'int':
    printed = "%d" % value
  data_segment.append("  dw %s" % printed)

def buffer(length, value = -1):
  for i in range(0, length):
    word(value)

def var(name, value = -1):
  data_label(name);
  word(value);

# Macros

def NOR(a, b, r):
  code_rem('NOR ' + str(a) + ' ' + str(b) + ' ' + str(r))
  code(a)
  code(b)
  code(r)

def NOT(a, r):
  NOR(a, a, r);

def OR(a, b, r):
  NOR(a, b, "or_reg")
  NOT("or_reg", r)
var("or_reg")

def AND(a, b, r):
  NOT(a, "and_reg_a")
  NOT(b, "and_reg_b")
  OR("and_reg_a", "and_reg_b", "and_reg_a")
  NOT("and_reg_a", r)
var("and_reg_a")
var("and_reg_b")

def ANDi(a, imm, r):
  MOVi(imm, "and_i_reg")
  AND(a, "and_i_reg", r)
var("and_i_reg")

def XOR(a, b, r):
  NOT(a, "xor_reg_a")
  NOT(b, "xor_reg_b")
  AND(a, "xor_reg_b", "xor_reg_b")
  AND(b, "xor_reg_a", "xor_reg_a")
  OR("xor_reg_a", "xor_reg_b", r)
var("xor_reg_a")
var("xor_reg_b")

def XORi(a, imm, r):
  MOVi(imm, "xor_i_reg")
  XOR(a, "xor_i_reg", r)
var("xor_i_reg")

def MOV(a, b):
  code_rem('MOV ' + str(a) + ' ' + str(b))
  NOT(a, "move_reg")
  NOT("move_reg", b)
  code_rem('MOV END')
var("move_reg")

def JMP(a):
  code_rem('JMP ' + str(a))
  MOV(a, "ip")

def JMPi(a):
  code_rem('JMPi ' + str(a))
  label = next_label()
  JMP(label)
  code_label(label)
  code(a)

def MOVi(imm, a):
  code_rem('MOVi #' + str(imm) + ' ' + str(a))
  label_data = next_label()
  label_jump = next_label()
  MOV(label_data, a)
  JMPi(label_jump)
  code_label(label_data)
  code(imm)
  code_label(label_jump)

# [a] -> b
def PEEK(a, b):
  label1 = next_label()
  label2 = next_label()
  MOV(a, label1)
  MOV(a, label2)
  code_label(label1)  # NOT(0, 0, move_reg)
  code(0)             # <- a
  code_label(label2)  #
  code(0)             # <- a
  code("move_reg")    #
  NOT("move_reg", b)

# a -> [b]
def POKE(a, b):
  code_rem('POKE ' + str(a) + ' [' + str(b) + ']')
  label = next_label()
  MOV(b, label)
  NOT(a, "move_reg")  # +3 (three operations)
  code("move_reg")    # +4
  code("move_reg")    # +5
  code_label(label)
  code(0)             # <- b

# imm -> [a]
def POKEi(imm, a):
  MOVi(imm, "poke_i_reg")
  POKE("poke_i_reg", a)
var("poke_i_reg")

def EXIT(a):
  MOV(a, "exit_reg")

def EXITi(a):
  MOVi(a, "exit_reg")

def FADD(mask, carry, a, b, r):
  AND(a, mask, "fadd_reg_a")  # zero bits in 'a' except mask'ed
  AND(b, mask, "fadd_reg_b")  # zero bits in 'b' except mask'ed
  AND(carry, mask, carry)     # zero bits in 'carry' except mask'ed

  # SUM = (a ^ b) ^ carry
  XOR(a, b, "fadd_reg_t1")
  XOR("fadd_reg_t1", carry, "fadd_reg_bit_r")

  # Leave only 'mask'ed bit in bit_r.
  AND("fadd_reg_bit_r", mask, "fadd_reg_bit_r")

  # Add current added bit to the result.
  OR("fadd_reg_bit_r", r, r)

  # CARRY = (a & b) | (carry & (a ^ b))
  AND(a, b, "fadd_reg_t2")
  AND(carry, "fadd_reg_t1", "fadd_reg_t1")

  # CARRY is calculated, and 'shift_reg' contains the same value
  # but shifted the left by 1 bit.
  OR("fadd_reg_t2", "fadd_reg_t1", carry)

  # CARRY is shifted the left by 1 bit to be used on the next round.
  MOV("shift_reg", carry)

  # shift_reg = mask << 1
  MOV(mask, mask)
  # mask = shift (effectively "mask = mask << 1")
  MOV("shift_reg", mask)

  AND(carry, mask, carry)

var("fadd_reg_a")
var("fadd_reg_b")
var("fadd_reg_bit_r")
var("fadd_reg_t1")
var("fadd_reg_t2")

def ZERO(a):
  XOR(a, a, a)

def FADC(a, b, r):
  ZERO("fadc_reg_t")
  MOV("const_1", "fadc_reg_mask")
  for i in range(0, 16):
    FADD("fadc_reg_mask", "carry_reg", a, b, "fadc_reg_t")
  MOV("fadc_reg_t", r)

  ZERO("fadc_reg_t")

  for i in range(0, 16):
    OR("fadc_reg_t", "carry_reg", "fadc_reg_t")
    MOV("carry_reg", "carry_reg")
    MOV("shift_reg", "carry_reg")

  MOV("fadc_reg_t", "carry_reg")

var("fadc_reg_mask")
var("fadc_reg_t")

def ADD(a, b, r):
  ZERO("carry_reg")
  FADC(a, b, r)

def ADDi(a, imm, r):
  MOVi(imm, "add_i_reg")
  ADD(a, "add_i_reg", r)
var("add_i_reg")

def PUSH(a):
  ADD("stack_reg", "const_minus_1", "stack_reg")
  POKE(a, "stack_reg")

def PUSHi(imm):
  MOVi(imm, "push_i_reg")
  PUSH("push_i_reg")
var("push_i_reg")

def POP(a):
  PEEK("stack_reg", a)
  ADD("stack_reg", "const_1", "stack_reg")

def CALL(a):
  label = next_label()
  PUSHi(label)
  JMP(a)
  code_label(label)

def CALLi(a):
  label = next_label()
  PUSHi(label)
  JMPi(a)
  code_label(label)

def RET():
  POP("ip")

# Jump 'a', if cond = FFFF, and 'b' if conf = 0000
def BRANCH(a, b, cond):
  AND(a, cond, "branch_reg_a")              # reg_a = a & cond
  NOT(cond, "branch_reg_b")                 # reg_b = !cond
  AND(b, "branch_reg_b", "branch_reg_b")    # reg_b = b & reg_b = b & !cond
  OR("branch_reg_a", "branch_reg_b", "ip")  # ip = (a & cond) | (b & !cond)
var("branch_reg_a")
var("branch_reg_b")

# Jump 'a', if cond = FFFF, and 'b' if conf = 0000
def BRANCHi(a, b, cond):
  MOVi(a, "branch_i_reg_a")
  MOVi(b, "branch_i_reg_b")
  BRANCH("branch_i_reg_a", "branch_i_reg_b", cond)
var("branch_i_reg_a")
var("branch_i_reg_b")

# if a != 0 -> carry = FFFF else carry = 0000
def IS_0(a):
  ZERO("carry_reg")
  FADC(a, "const_minus_1", "is_0_reg")
  NOT("carry_reg", "zero_reg")
var("is_0_reg")
var("zero_reg")

# ip = (zero_reg == FFFF ? a : ip)
def JZi(a):
  label = next_label()
  BRANCHi(a, label, "zero_reg")
  code_label(label)

# ip = (zero_reg == FFFF ? a : ip)
def JNZi(a):
  label = next_label()
  BRANCHi(label, a, "zero_reg")
  code_label(label)

def ROL(a, b):
  MOV(a, a)            # shift_reg = a << 1
  MOV("shift_reg", b)

def ROR(a, b):
  MOV(a, "ror_reg")
  for i in range(0, 15):
    ROL("ror_reg", "ror_reg")
  MOV("ror_reg", b)
var("ror_reg")

def SHL(a, b):
  ROL(a, b)
  ANDi(b, 0x0001, b)

def SHR(a, b):
  ROR(a, b)
  ANDi(b, 0x7FFF, b)

def MUL3(a, b):
  ADD(a, a, "mul3_reg")    # mul3_reg = a + a
  ADD("mul3_reg", a, b)    # b = mul3_reg + a
var("mul3_reg")

# NORCPU code

var("ip", "start")
var("shift_reg")
var("carry_reg")
var("const_1", 1)
var("const_minus_1", 0xFFFF)
var("exit_reg")

var("stack_reg", "stack")

code_label("start")

var("ch")
var("t")
var("xor_mask")
var("cmp_flag")

var("ptr")
var("ptr2")
var("i")

MOVi("exchange", "ptr")
MOVi("secret_password", "ptr2")
MOVi(secret_password_xor_mask, "xor_mask")
MOVi(0, "cmp_flag")
MOVi(len(secret_password), "i")

cmp_loop = next_label()
code_label(cmp_loop)               # cmp_loop:
PEEK("ptr", "ch")                                      # ch = *ptr
XOR("ch", "xor_mask", "ch")                            # ch ^= xor_mask
PEEK("ptr2", "t")                                      # t = *ptr2
XOR("ch", "t", "ch")                                   # ch = ch ^ t
OR("cmp_flag", "ch", "cmp_flag")                       # cmp_flag |= ch
ADD("ptr", "const_1", "ptr")                           # ptr += 1
ADD("ptr2", "const_1", "ptr2")                         # ptr2 += 1
MUL3("xor_mask", "xor_mask")                           # xor_mask *= 3
ADDi("xor_mask", secret_password_add, "xor_mask")      # xor_mask += add_const
ADD("i", "const_minus_1", "i")                         # i -= 1
IS_0("i")
JNZi(cmp_loop)

MOVi(0, "exchange_sz")

ok_label = next_label()
IS_0("cmp_flag")
JZi(ok_label)

exit_label = next_label()
JMPi(exit_label)

code_label(ok_label)

MOVi("secret_code", "ptr")
MOV("secret_code_sz", "i")
MOVi(secret_code_xor_mask, "xor_mask")

MOVi("exchange", "ptr2")

MOV("i", "exchange_sz")

loop = next_label()
code_label(loop)                   # loop:
PEEK("ptr", "ch")                             # ch = *ptr
XOR("ch", "xor_mask", "ch")                   # ch ^= xor_mask
POKE("ch", "ptr2")                            # *ptr2 = ch
MUL3("xor_mask", "xor_mask")                  # xor_mask *= 3
ADDi("xor_mask", secret_code_add, "xor_mask") # xor_mask += add_const
ADD("ptr", "const_1", "ptr")                  # ptr += 1
ADD("ptr2", "const_1", "ptr2")                # ptr2 += 1
ADD("i", "const_minus_1", "i")                # i = i - 1
IS_0("i")
JNZi(loop)

code_label(exit_label)             # exit_label:
EXITi(0x00)

buffer(8)
data_label("stack")

var("secret_code_sz", len(secret_code))
data_label("secret_code")
buffer(len(secret_code))

var("secret_password_sz")
data_label("secret_password")
buffer(16)

var("exchange_sz", 0)
data_label("exchange")
buffer(32)

# Compiler

text = code_segment
text.extend(data_segment)

if verbose:
  print "\n".join(text)

# Phase 1. Calculate names.

addr = 0
names = {}
for line in text:
  if line[0] == ';': continue
  if line[0] != ' ':
    name = line.partition(':')[0]
    names[name] = addr
  else:
    addr = addr + 1

if verbose:
  print names

raw_text = "\n".join(text)

# Resolve names.

for name in names:
  if verbose:
    print name, names[name], type(names[name])
  name_re = re.compile(r'dw ' + name + '$', re.M)
  value = "%d" % names[name]
  raw_text = name_re.sub('dw ' + value, raw_text)

text = raw_text.split("\n")

if verbose:
  print "\n".join(text)

# Phase 2. Compilation.

addr = 0
comment = ""
mem = []
for line in text:
  if line[0] == ';' or line[0] != ' ':
    comment = comment + line + ' '
  else:
    value = int(line.strip().partition(" ")[2])
    if verbose:
      print "%04X: %04X ; %s" % (addr, value, comment)
    mem.append(value)
    addr = addr + 1
    comment = ""

# Interpretation

ip = names["ip"]
exit_reg = names["exit_reg"]
shift_reg = names["shift_reg"]
carry_reg = names["carry_reg"]

def nor(a, b):
  r = a | b
  r = r ^ 0xFFFF
  return r & 0xFFFF

def norcpu():
  while 1:
    i = mem[ip];
    a = mem[i + 0]
    b = mem[i + 1]
    r = mem[i + 2]
    mem[ip] = i + 3
    f = nor(mem[a], mem[b])
    mem[r] = f
    mem[shift_reg] = ((f >> 15) & 1) | ((f & 0x7FFF) << 1)

    if verbose_cpu:
      print "%04X: %04X [%04X] %04X [%04X] -> %04X [%04X]" % \
            (i, a, mem[a], b, mem[b], r, mem[r])
    if r == exit_reg:
      break

print "Starting from [%04X]" % mem[ip]

encode_string(secret_code, "secret_code", secret_code_xor_mask, secret_code_add);
encode_string(secret_password, "secret_password", secret_password_xor_mask, secret_password_add);

mem_js = dump_js(mem)
save_mem("norcpu-1-before.bin")
mem_sz = len(mem)

if len(mem) >= 0x10000:
  print "Too much code (%08X, %04X)" % (len(mem), len(mem) - 0x10000)
  sys.exit()

# Inject plain password in the last moment (for testing).
put_string(guess, "exchange")

save_mem("norcpu-2-before-with-password.bin")

if verbose:
  print "Original memory:"
  print dump(mem)

start_time = time.time()

norcpu()

end_time = time.time()

save_mem("norcpu-3-after.bin", mem_sz)

if verbose:
  print "Memory after:"
  dump(mem)

print
print "Size: %X" % len(mem)
print "Time: %d" % (end_time - start_time)
print "Exit: %04X" % mem[exit_reg]

exchange = names["exchange"]
result_value = ""
for i in range(0, mem[names["exchange_sz"]]):
  result_value = result_value + chr(mem[exchange + i] & 0xff)

print "Result: [%s]" % result_value

if len(result_value) == 0:
  print "ERROR: Wrong password"

js = string.Template(open('template.html', 'r').read())

js = js.substitute( \
  ip = names["ip"],
  exit_reg = names["exit_reg"],
  shift_reg = names["shift_reg"],
  exchange = names["exchange"],
  exchange_sz = names["exchange_sz"],
  mem_js = mem_js
)

f = open("norcpu2.html", "w")
f.write(js)
f.close()
{% endcodeblock %}

[Solution repository]: https://github.com/begoon/norcpu/
[NORCPU hackme challenge]: /blog/english/2011/02/08/norcpu-hackme-challenge/
[Problem]: /projects/norcpu/challenge/norcpu.html
[Problem 2]: /projects/norcpu/challenge/norcpu2.html
