import pprint
import json

# Ble bare brukt for å populate dictionary og dumpe json filen
ascii_char_dic = {}

for i in range(0, 256):
        char = chr(i)
        ascii_char_dic[char] = { 'dec': str(i).zfill(3), 'bin': format(i, '08b'), 'hex': format(i, '02x') }

pprint.pprint(ascii_char_dic)

ascii_bin_dic = {}
ascii_hex_dic = {}
ascii_dec_dic = {}

for char, data in ascii_char_dic.items():
    ascii_bin_dic[data['bin']] = { 'char': char, 'dec': data['dec'], 'hex': data['hex'] }
    ascii_hex_dic[data['hex']] = { 'char': char, 'dec': data['dec'], 'bin': data['bin'] }
    ascii_dec_dic[data['dec']] = { 'char': char, 'bin': data['bin'], 'hex': data['hex'] }

pprint.pprint(ascii_bin_dic)
pprint.pprint(ascii_hex_dic)
pprint.pprint(ascii_dec_dic)

combined_ascii_dic = { "ascii_char_dic": ascii_char_dic,
                       "ascii_bin_dic": ascii_bin_dic,
                       "ascii_hex_dic": ascii_hex_dic,
                       "ascii_dec_dic": ascii_dec_dic }

with open("ascii_dic.json", "w") as file:
    json.dump(combined_ascii_dic, file, indent=4)
