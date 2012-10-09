function tape_file() {
var file = {
name: "MORSE16.RKR",
start: 0x0000,
end: 0x02df,
entry: 0x0000,
image:
"\xC3\xD3\x02\x21\x69\x02\xCD\x18\xF8\x3E\x00\x32\x02\x08\x21\x00\x00\x22\x03\x08\x2A\xBA\x02\x22\x0B\x08\xCD\xE7\x00\xCD\x19\x01" +
"\xCD\xD8\x00\x3A\xBE\x02\x57\xCD\xAB\x00\xCD\x22\x01\xCD\xC3\x02\xC2\x27\x00\x0E\x01\x06\x00\xCD\x19\x01\x04\xCA\x27\x00\xCD\xC3" +
"\x02\xCA\x37\x00\x3E\x02\xB8\xD2\x37\x00\x7A\x87\xB8\xDA\x5B\x00\x7A\x80\x0F\xE6\x7F\x57\x79\x87\xC3\x65\x00\x7A\x80\x0F\x0F\xE6" +
"\x3F\x57\x79\x87\x3C\x4F\xFE\x80\xD2\x27\x00\x06\x00\xCD\x19\x01\x04\xCD\xC3\x02\xCA\x35\x00\x7A\x87\xB8\xD2\x6D\x00\x06\x00\x2A" +
"\x05\x08\x3E\x1F\xB9\xD2\x8B\x00\x21\xE9\x01\x09\x7E\xCD\xE9\x00\x06\x00\xCD\x19\x01\x04\xCD\xC3\x02\xCA\x27\x00\x7A\x87\x87\x90" +
"\xD2\x92\x00\x3E\x20\xCD\xE9\x00\xC3\x27\x00\x3A\x00\x08\x4F\xCD\x1B\xF8\xB9\xC8\x32\x00\x08\xFE\x52\xCA\xD1\x00\xFE\x4C\xCA\xD8" +
"\x00\xFE\x0D\xCA\xE7\x00\xFE\x03\xCA\xDF\x00\xFE\x1B\xCA\xE3\x00\xC9\x21\xE9\x01\x22\x05\x08\xC9\x21\xCB\x01\x22\x05\x08\xC9\x2A" +
"\xBF\x02\xE9\x2A\xC1\x02\xE9\x3E\xA0\xE5\xC5\xF5\x3A\x04\x08\x4F\x3C\xE6\x3F\x32\x04\x08\x06\x00\x21\x0F\x08\x09\x3A\x01\x08\x3D" +
"\xFA\x0C\x01\x32\x01\x08\x78\x47\xF1\xC3\x15\x01\x3A\xBD\x02\x32\x01\x08\xF1\xF6\x80\x77\xC1\xE1\xC9\xCD\x22\x01\xCD\x22\x01\xCD" +
"\x22\x01\xE5\xD5\xC5\xF5\x3A\x02\x08\xB7\xCA\x33\x01\xCD\x8D\x01\xC3\x65\x01\x2A\x03\x08\x7C\xBD\xC2\x44\x01\x3A\xBC\x02\xCD\xC2" +
"\x01\xC3\x65\x01\x4D\x06\x00\x21\x0F\x08\x09\x7E\xFE\x80\xF5\xE6\x7F\x2A\x0B\x08\x77\xF1\xDC\xB1\x01\xD4\x6A\x01\x3A\x03\x08\x3C" +
"\xE6\x3F\x32\x03\x08\xF1\xC1\xD1\xE1\xC9\x2A\xBA\x02\x22\x0B\x08\x11\x4E\x00\x19\x22\x0D\x08\x36\x5F\x2A\xB8\x02\x22\x07\x08\x19" +
"\x22\x09\x08\x3A\xBC\x02\xD6\x02\x32\x02\x08\xD6\x09\x4F\x2A\x09\x08\xEB\x2A\x07\x08\x1A\x77\x13\x23\x0D\xC2\x95\x01\x22\x07\x08" +
"\xEB\x22\x09\x08\x2A\x0D\x08\x7B\x95\x7A\x9C\xD8\xAF\x32\x02\x08\xC9\xF5\x23\x36\x5F\x22\x0B\x08\x3A\xBC\x02\xD6\x04\xCD\xC2\x01" +
"\xF1\xC9\x00\x00\x00\x00\x00\x00\x3D\xC2\xC2\x01\xC9\x45\x54\x49\x41\x4E\x4D\x53\x55\x52\x57\x44\x4B\x47\x4F\x48\x56\x46\x60\x4C" +
"\x71\x50\x4A\x42\x58\x43\x59\x5A\x51\x7E\x7B\x65\x74\x69\x61\x6E\x6D\x73\x75\x72\x77\x64\x6B\x67\x6F\x68\x76\x66\x60\x6C\x71\x70" +
"\x6A\x62\x78\x63\x79\x7A\x7D\x7E\x7B\x35\x34\x5F\x33\x7C\x5F\x5F\x32\x5F\x5F\x2B\x5F\x5F\x5F\x5F\x31\x36\x3D\x2F\x5F\x5F\x5F\x5F" +
"\x5F\x37\x5F\x5F\x5F\x38\x5F\x39\x30\x2E\x5F\x5F\x5F\x5F\x5F\x5F\x5F\x5F\x5F\x5F\x5F\x3F\x5F\x5F\x5F\x5F\x5F\x5F\x5F\x5F\x2C\x5F" +
"\x5F\x5F\x5F\x5F\x5F\x5F\x5F\x5F\x5F\x5F\x5F\x5F\x5F\x5F\x5F\x5F\x5F\x5F\x5F\x5F\x5F\x5F\x5F\x5F\x5F\x5F\x5F\x5F\x21\x5F\x5F\x5F" +
"\x5F\x5F\x5F\x5F\x5F\x5F\x5F\x5F\x5F\x1F\x2B\x2D\x2D\x2D\x2B\x2D\x2D\x2D\x2D\x2D\x2D\x2D\x2D\x2D\x2D\x2D\x2D\x2D\x2D\x2D\x2D\x2D" +
"\x2B\x0A\x0D\x21\x20\x20\x20\x21\x20\x55\x54\x35\x44\x45\x2F\x55\x41\x33\x20\x43\x57\x20\x52\x58\x20\x21\x0A\x0D\x2B\x2D\x2D\x2D" +
"\x2B\x2D\x2D\x2D\x2D\x2D\x2D\x2D\x2D\x2D\x2D\x2D\x2D\x2D\x2D\x2D\x2D\x2D\x2B\x0D\x19\x18\x18\x00\xAC\x38\x12\x3F\x80\x40\x10\x6C" +
"\xF8\x00\x00\x3A\x00\xA0\xE6\x01\x3E\x7F\xCA\xCF\x02\x3E\x20\x32\x12\x38\xC9\x3E\x90\x32\x03\xA0\x31\x00\x09\xC3\x03\x00\x00\x00"};
ui.file_loaded(file);
}
tape_file();