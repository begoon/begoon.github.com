GMC-4 loader port layout
========================

 Key| Code | Port B: 43210 | IC2 PB3:PB2 |    Row      | IC1 PB4:PB1:PB0 |     Column      | Crossing
 ---|------|---------------|-------------|-------------|-----------------|-----------------|----------
  0 |  00  |         00000 |        00   | 0,1,2,3,RST |         000     | 0,4,8,C         |  0
  1 |  01  |         00001 |        00   | 0,1,2,3,RST |         001     | 1,5,9,D         |  1
  2 |  02  |         00010 |        00   | 0,1,2,3,RST |         010     | 2,6,A,E         |  2
  3 |  03  |         00011 |        00   | 0,1,2,3,RST |         011     | 3,7,B,F         |  3
  4 |  04  |         00100 |        01   | 4,5,6,7,RUN |         000     | 0,4,8,C         |  4
  5 |  05  |         00101 |        01   | 4,5,6,7,RUN |         001     | 1,5,9,D         |  5
  6 |  06  |         00110 |        01   | 4,5,6,7,RUN |         010     | 2,6,A,E         |  6
  7 |  07  |         00111 |        01   | 4,5,6,7,RUN |         011     | 3,7,B,F         |  7
  8 |  08  |         01000 |        10   | 8,9,A,B,INC |         000     | 0,4,8,C         |  8
  9 |  09  |         01001 |        10   | 8,9,A,B,INC |         001     | 1,5,9,D         |  9
  A |  0A  |         01010 |        10   | 8,9,A,B,INC |         010     | 2,6,A,E         |  A
  B |  0B  |         01011 |        10   | 8,9,A,B,INC |         011     | 3,7,B,F         |  B
  C |  0C  |         01100 |        11   | C,D,E,F,ADR |         000     | 0,4,8,C         |  C
  D |  0D  |         01101 |        11   | C,D,E,F,ADR |         001     | 1,5,9,D         |  D
  E |  0E  |         01110 |        11   | C,D,E,F,ADR |         010     | 2,6,A,E         |  E
  F |  0F  |         01111 |        11   | C,D,E,F,ADR |         011     | 3,7,B,F         |  F
 RST|  10  |         10000 |        00   | 0,1,2,3,RST |         100     | RST,RUN,INC,ADR |  RST
 RUN|  14  |         10100 |        01   | 4,5,6,7,RUN |         100     | RST,RUN,INC,ADR |  RUN
 INC|  18  |         11000 |        10   | 8,9,A,B,INC |         100     | RST,RUN,INC,ADR |  INC
 ADR|  1C  |         11100 |        11   | C,D,E,F,ADR |         100     | RST,RUN,INC,ADR |  ADR
 
This is a simplified version of the original `gmc.c`.

``` c
#define GMC4_ADRSET 0x1C  /* 00011100 */
#define GMC4_INCR   0x18  /* 00011000 */
#define GMC4_RUN    0x14  /* 00010100 */
#define GMC4_RESET  0x10  /* 00010000 */

void gmc4wait(short waittime) { do {} while(waittime-- > 0); }

void gmc4init() {
    DDRB |= 0x1f;
    DDRB |= 1 << 6;
}

void gmc4_simulate_key(unsigned char key) {
    PORTB &= ~0x1f;
    PORTB |= 0x1f & key;
    
    PORTB &= ~(1 << 6);
    gmc4wait(8000);
    PORTB |= ~(1 << 6);
    gmc4wait(8000);
}

void gmc4sendkey(char key) {
    if (key >= '0' && key <= '9') {
        gmc4_simulate_key(key - '0');
    } else if(key >= 'A' && key <= 'F') {
        gmc4_simulate_key(key - 'A' + 10);
    } else if(key >= 'a' && key <= 'f') {
        gmc4_simulate_key(key - 'a' + 10);
    } else if(key == 'S' || key == 's') {
        gmc4_simulate_key(GMC4_ADRSET);
    } else if(key == 'I' || key == 'i') {
        gmc4_simulate_key(GMC4_INCR);
    } else if(key == 'G' || key == 'g') {
        gmc4_simulate_key(GMC4_RUN);
    } else if(key == 'R' || key == 'r') {
        gmc4_simulate_key(GMC4_RESET);
    }
}
```
