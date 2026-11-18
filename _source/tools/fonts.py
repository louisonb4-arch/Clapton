import re, subprocess, os
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36"
OUT = '../../fonts'
os.makedirs(OUT, exist_ok=True)
for fam, w, name in [('Montserrat', 400, 'montserrat-400'), ('Montserrat', 500, 'montserrat-500'),
                     ('Montserrat', 600, 'montserrat-600'), ('Montserrat', 700, 'montserrat-700'),
                     ('Lexend+Giga', 600, 'lexend-giga-600'), ('Lexend+Giga', 800, 'lexend-giga-800'),
                     ('Caveat', 600, 'caveat-600')]:
    css = subprocess.run(['curl', '-s', '-A', UA, f'https://fonts.googleapis.com/css2?family={fam}:wght@{w}&display=swap'], capture_output=True, text=True).stdout
    block = css.split('/* latin */')[1]
    url = re.search(r'url\((https://[^)]+)\)', block).group(1)
    subprocess.run(['curl', '-s', '-o', f'{OUT}/{name}.woff2', url])
    print(name, os.path.getsize(f'{OUT}/{name}.woff2'))
