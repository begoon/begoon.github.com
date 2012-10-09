function tape_file() {
var file = {
name: "GLASS1.GAM",
start: 0x0000,
end: 0x05ff,
entry: 0x0000,
image:
"\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00" +
"\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00" +
"\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00" +
"\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00" +
"\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00" +
"\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00" +
"\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00" +
"\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00" +
"\xC3\x90\x04\x00\x06\x00\x04\x80\x02\xC0\x01\x00\x01\xB0\x00\x80\x00\x50\x00\x20\x00\x03\x00\x07\x00\x0F\x00\x2D\x00\x78\x00\x2C" +
"\x01\x58\x02\x00\x01\x08\x18\x0C\x00\x00\x00\x03\x00\x00\x00\x00\x00\x00\x00\x34\x12\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\xE5" +
"\xC5\x0E\x1B\xCD\x09\xF8\x0E\x59\xCD\x09\xF8\x7A\xC6\x20\x4F\xCD\x09\xF8\x7B\xC6\x20\x4F\xCD\x09\xF8\xC1\xE1\xC9\xCD\x3F\x01\x06" +
"\x19\x0E\x7B\xCD\x09\xF8\x0E\x08\xCD\x09\xF8\x0E\x1A\xCD\x09\xF8\x05\xC2\x61\x01\xC9\xCD\x3F\x01\x23\x7E\xE5\xCD\x15\xF8\xE1\x2B" +
"\x7E\xE5\xCD\x15\xF8\xE1\x23\x23\xC9\x7B\x86\x27\x77\x23\x7A\x8E\x27\x77\xC9\xC5\xD5\xE5\x2A\x33\x01\x06\x19\x54\x5D\x19\x7C\xAA" +
"\x07\xE6\x01\xB5\x6F\x05\xC2\x9B\x01\x22\x33\x01\x7D\xE1\xD1\xC1\xC9\x18\x19\x08\x1A\xF5\xE6\x03\xE5\xC5\x06\x00\x4F\x21\xB1\x01" +
"\x09\x7E\x4F\xFE\x19\xC2\xD4\x01\xE5\xCD\x1E\xF8\x3A\x2B\x01\xBC\xE1\xCA\xD8\x01\x4E\xCD\x09\xF8\xC1\xE1\xF1\xC9\xFB\x2A\x39\x01" +
"\xEB\xCD\x3F\x01\x3A\x3B\x01\x06\x05\xCD\x09\xF8\xCD\xB5\x01\xC5\x0E\x08\xCD\x09\xF8\xC1\x0F\x0F\x05\xC2\xE9\x01\xF3\xC9\x26\x80" +
"\xC9\x2A\x3C\x01\xEB\xCD\x3F\x01\x06\x05\x26\xFF\x3A\x3E\x01\xF5\xE5\xC5\xCD\x21\xF8\xC1\xE1\xFE\x7B\xCC\xFE\x01\xF1\xCD\xB5\x01" +
"\x0F\x0F\x05\xC2\x0F\x02\x7C\xC9\x26\x00\xCD\x93\x01\xE6\x0F\xC6\x24\x6F\x22\x39\x01\x22\x3C\x01\xCD\x93\x01\x32\x3B\x01\x32\x3E" +
"\x01\xC9\xCD\x01\x02\xFE\x80\xC8\x0E\x2E\xCD\xDC\x01\x2A\x3C\x01\x22\x39\x01\x3A\x3E\x01\x32\x3B\x01\x0E\x7F\xCD\xDC\x01\x3E\xFF" +
"\xC9\x2A\x39\x01\x3A\x3B\x01\xC9\xCD\x61\x02\x24\x22\x3C\x01\x32\x3E\x01\xCD\x42\x02\xC9\xCD\x68\x02\xFE\x80\xC2\x76\x02\xC3\xA9" +
"\x05\xCD\x61\x02\x2D\xC3\x6C\x02\xCD\x61\x02\x2C\xC3\x6C\x02\xCD\x61\x02\x0E\x01\xC3\x9C\x02\xCD\x61\x02\x0E\x03\xCD\xF0\x02\x32" +
"\x3E\x01\x22\x3C\x01\x06\x0A\x21\xDC\x02\xC5\x01\x3C\x01\x0A\x86\x5F\x03\x0A\x23\x86\x57\x23\xE5\x2A\x3C\x01\xE5\xEB\x22\x3C\x01" +
"\x7D\xFE\x37\xD2\xCE\x02\xFE\x1D\xDA\xCE\x02\xCD\x42\x02\xE1\x22\x3C\x01\xE1\xFE\xFF\xC1\xC8\x05\xC2\xAA\x02\xC9\x00\x00\x00\xFF" +
"\x01\x00\xFF\x00\x02\x00\xFE\x00\x03\x00\xFD\x00\x04\x00\xFC\x00\x06\x04\x57\xE6\x03\x81\xE6\x03\x5F\x7A\xE6\xFC\xB3\x0F\x0F\x05" +
"\xC2\xF2\x02\xC9\x26\x00\x54\x1E\x1E\xCD\x3F\x01\x2E\x19\x06\xFF\xC5\xE5\xCD\x21\xF8\x0E\x18\xCD\x09\xF8\xE1\xC1\xFE\x7B\xCA\x23" +
"\x03\x06\x00\x2D\xC2\x10\x03\x78\xA7\xC2\x36\x03\x24\x7C\xFE\x18\xC2\x06\x03\x3E\x00\xC9\x54\x1E\x1E\xCD\x3F\x01\x2E\x19\xE5\x0E" +
"\x19\xCD\x09\xF8\xCD\x21\xF8\x0E\x1A\xCD\x09\xF8\x4F\xCD\x09\xF8\xE1\x2D\xC2\x3E\x03\x25\x3E\xFF\xC2\x36\x03\x3A\x36\x01\x3C\x3C" +
"\x32\x36\x01\xC9\x2A\x37\x01\xBE\x23\x22\x37\x01\xC9\x21\x2C\x01\x11\x13\x0C\xCD\x75\x01\xC9\x1F\x20\x3C\x3C\x3C\x20\x73\x20\x74" +
"\x20\x61\x20\x6B\x20\x61\x20\x6E\x20\x3E\x3E\x3E\x0A\x0D\x0A\x20\x75\x70\x72\x61\x77\x6C\x65\x6E\x69\x65\x3A\x0A\x0D\x0A\x3C\x2D" +
"\x20\x20\x77\x6C\x65\x77\x6F\x0A\x0D\x2D\x3E\x20\x20\x77\x70\x72\x61\x77\x6F\x0A\x0D\x46\x31\x20\x20\x70\x6F\x77\x65\x72\x6E\x75" +
"\x74\x78\x20\x77\x6C\x65\x77\x6F\x0A\x0D\x46\x32\x20\x20\x70\x6F\x77\x65\x72\x6E\x75\x74\x78\x20\x77\x70\x72\x61\x77\x6F\x0A\x0D" +
"\x48\x4F\x4D\x45\x2D\x75\x72\x6F\x6E\x69\x74\x78\x20\x53\x50\x41\x43\x45\x2D\x6F\x73\x74\x61\x6E\x6F\x77\x0A\x0D\x46\x34\x20\x20" +
"\x7A\x61\x6B\x6F\x6E\x7E\x69\x74\x78\x0D\x0A\x0A\x0A\x74\x65\x6B\x75\x7D\x69\x6A\x20\x72\x65\x7A\x75\x6C\x78\x74\x61\x74\x3A\x20" +
"\x0A\x0D\x0A\x0A\x72\x65\x7A\x75\x6C\x78\x74\x61\x74\x3A\x0A\x0D\x0A\x0A\x6C\x75\x7E\x7B\x69\x6A\x20\x72\x65\x7A\x75\x6C\x78\x74" +
"\x61\x74\x3A\x0A\x0D\x0A\x0A\x77\x61\x7B\x20\x6B\x6C\x61\x73\x73\x20\x28\x31\x2D\x38\x29\x3A\x20\x0A\x0D\x0A\x20\x20\x20\x20\x20" +
"\x20\x20\x2A\x41\x4C\x47\x2A\x20\x20\x77\x65\x72\x73\x2E\x33\x2E\x31\x0A\x0D\x20\x20\x28\x43\x29\x31\x39\x38\x38\x20\x6B\x6F\x6C" +
"\x6F\x6D\x6E\x61\x20\x22\x69\x6E\x74\x65\x67\x72\x61\x6C\x22\x00\x31\x34\x06\x21\x77\x03\xCD\x18\xF8\x11\x1D\x00\xCD\x5C\x01\x11" +
"\x37\x00\xCD\x5C\x01\x11\x1D\x18\xCD\x3F\x01\x06\x1A\x0E\x7B\xCD\x09\xF8\x05\xC2\xAF\x04\x26\x00\x2E\x19\x54\x1E\x1E\xCD\x3F\x01" +
"\x0E\x2E\xCD\x09\xF8\x2D\xC2\xC0\x04\x24\x7C\xFE\x18\xC2\xB8\x04\x2A\x30\x01\x7D\x2F\x5F\x7C\x2F\x57\x2A\x2C\x01\x22\x2E\x01\x19" +
"\xD2\xE9\x04\x2A\x2C\x01\x22\x30\x01\x21\x03\x00\x22\x2C\x01\x21\x2C\x01\x11\x13\x0C\xCD\x75\x01\x11\x13\x0F\xCD\x75\x01\x11\x13" +
"\x12\xCD\x75\x01\xCD\x28\x02\x11\x13\x15\xCD\x3F\x01\xCD\x03\xF8\xFE\x31\xDA\x0D\x05\xFE\x39\xD2\x0D\x05\xD6\x31\xE6\x07\x32\x32" +
"\x01\xC6\x31\x4F\xCD\x09\xF8\x3E\x00\x32\x35\x01\x31\x34\x06\x3A\x35\x01\x3C\xFE\x08\xF5\xE6\x07\x32\x35\x01\xF1\x11\x00\x00\x21" +
"\x2C\x01\xC2\x48\x05\x11\x99\x99\xCD\x89\x01\xCD\x6D\x03\xCD\x68\x02\xFE\xFF\xC2\xA9\x05\x3A\x32\x01\x07\x5F\x16\x00\x21\x03\x01" +
"\x19\x5E\x23\x56\xEB\x11\xFF\xFF\xE5\xD5\xCD\x12\xF8\x2F\xA7\xCC\x03\xF8\xFE\x03\xCA\x90\x04\xFE\x20\xCC\x03\xF8\x21\x23\x01\x22" +
"\x37\x01\xCD\x64\x03\xCC\x8F\x02\xCD\x64\x03\xCC\x97\x02\xCD\x64\x03\xCC\x81\x02\xCD\x64\x03\xCC\x88\x02\xCD\x64\x03\xCA\x76\x02" +
"\xD1\xE1\x19\xDA\x68\x05\xC3\x2C\x05\x0E\x7B\xCD\xDC\x01\xAF\x32\x36\x01\x1E\xFE\x1C\x1C\xD5\xCD\x04\x03\xD1\xA7\xC2\xB4\x05\x21" +
"\x15\x01\x16\x00\x19\x5E\x23\x56\x21\x2C\x01\xCD\x89\x01\x06\x18\x11\x1E\x00\xCD\x3F\x01\xC5\xCD\x21\xF8\xC1\xFE\x7B\xCA\x90\x04" +
"\x0E\x18\xCD\x09\xF8\x05\xC2\xD6\x05\xCD\x28\x02\x0E\x07\xCD\x09\xF8\xC3\x2C\x05\xCA\x90\x04\xFE\x20\xCC\x03\xF8\x21\x23\x01\x22"};
ui.file_loaded(file);
}
tape_file();