"""Renderiza la franja compacta a partir de datos editoriales verificados."""
import json,sys,html
from pathlib import Path

def render(data):
    esc=lambda x:html.escape(str(x),quote=True)
    cells=[]
    for item in data['weather']:
        cells.append(f'<a class="ps-cell ps-weather" href="{esc(item["source_url"])}" target="_blank" rel="noopener noreferrer" title="{esc(item["source"])} · {esc(item["period"])}"><span class="ps-name">{esc(item["city"])}</span><strong>{esc(item["max_c"])} °C <em>máx.</em></strong><span class="ps-detail">{esc(item["summary"])}</span></a>')
    for item in data['indicators']:
        cells.append(f'<a class="ps-cell ps-economic" href="{esc(item["source_url"])}" target="_blank" rel="noopener noreferrer" title="{esc(item["source"])} · {esc(item["unit"])}"><span class="ps-name">{esc(item["label"])}</span><strong>{esc(item["display"])}</strong><span class="ps-detail">{esc(item["date_label"])}</span></a>')
    return '<section class="panorama-service" aria-label="Pronóstico e indicadores económicos"><div class="ps-heading"><b>Tiempo e indicadores</b><span>'+esc(data['display_updated'])+'</span></div><div class="ps-grid">'+''.join(cells)+'</div><div class="ps-foot"><span>'+esc(data['weather_note'])+'</span><span>Valores en pesos chilenos · Banco Central / SII</span></div></section>'
if __name__=='__main__':
    print(render(json.loads(Path(sys.argv[1]).read_text())))
