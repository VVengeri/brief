import { IFormData, ISection, IField, IFile } from '../types';
import { STUDIO_NAME } from '../config';

const getValueFromPath = (obj: any, path: string): any => {
    return path.split('.').reduce((acc, part) => {
        const index = parseInt(part, 10);
        if (acc === null || acc === undefined) return undefined;
        if (!isNaN(index) && Array.isArray(acc)) {
            return acc[index];
        }
        return acc[part];
    }, obj);
};

const formatValueForHtml = (value: any, field: IField): { html: string, isEmpty: boolean } => {
    const isValueEmpty = value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0);

    if (isValueEmpty) {
        return { html: `<div class="value unfilled">Не заполнено</div>`, isEmpty: true };
    }

    if (field.type === 'file' && Array.isArray(value)) {
        const files = value as IFile[];
        if (files.length === 0) return { html: `<div class="value unfilled">Не заполнено</div>`, isEmpty: true };
        
        const fileItems = files.map(file => {
            return file.type.startsWith('image/')
                ? `<img src="${file.content}" alt="${file.name}" style="max-width: 200px; max-height: 200px; border-radius: 6px; margin-top: 4px;" />`
                : `<span>📄 ${file.name}</span>`;
        }).join('');
        return { html: `<div class="value">${fileItems}</div>`, isEmpty: false };
    }

    if (field.id === 'style.palettes' && Array.isArray(value)) {
        const items = value.map(itemValue => {
            const option = field.options?.find(opt => opt.value === itemValue);
            if (!option) return `<strong>${String(itemValue)}</strong>`;
            
            const combination = option.deepDive?.combination?.split(' + ').slice(0, 3).join(', ') ?? '';
            return `<strong>${option.label}</strong> &mdash; ${combination}`;
        }).join('<br>');
        return { html: `<div class="value">${items}</div>`, isEmpty: value.length === 0 };
    }

    if (Array.isArray(value)) {
        const items = value.map(itemValue => {
            const option = field.options?.find(opt => opt.value === itemValue);
            return option ? option.label : String(itemValue);
        }).join('; ');
        return { html: `<div class="value"><strong>${items}</strong></div>`, isEmpty: false };
    }
    
    if (field.type.startsWith('room-toggle') || typeof value === 'boolean') {
        const boolValue = field.type === 'room-toggle-counter' ? value > 0 : !!value;
        const chipClass = boolValue ? 'true' : 'false';
        const label = boolValue ? (typeof value === 'number' ? value : 'Да') : 'Нет';
        const displayValue = typeof label === 'number' ? `<strong>${label}</strong>` : `<span class="chip ${chipClass}">${label}</span>`;
        return { html: `<div class="value">${displayValue}</div>`, isEmpty: !boolValue };
    }

    if ((field.type === 'enum' || field.type === 'radio' || field.type.startsWith('visual')) && field.options) {
        const option = field.options.find(opt => opt.value === value);
        if (option) return { html: `<div class="value"><strong>${option.label}</strong></div>`, isEmpty: false };
    }

    return { html: `<div class="value"><strong>${String(value).replace(/\n/g, '<br>')}</strong></div>`, isEmpty: false };
};


export const generateHtmlContent = (formData: IFormData, sections: ISection[]): string => {
    
    const renderSection = (section: ISection, index: number) => {
        if (['summary', 'dynamic_rooms_placeholder'].includes(section.id)) return '';
        if (section.condition && !section.condition(formData, section.id)) return '';

        let fieldsHtml = '';
        
        const allFields: IField[] = [...section.fields];
        if (section.subSections) {
            section.subSections.forEach(sub => {
                if (!sub.condition || sub.condition(formData, sub.id)) {
                    // Could add a sub-header here if desired
                    allFields.push(...sub.fields);
                }
            });
        }

        allFields.forEach(field => {
            if (field.condition && !field.condition(formData, field.id)) return;
            
            const value = getValueFromPath(formData, field.id);
            const { html, isEmpty } = formatValueForHtml(value, field);
            
            const isFull = ['textarea', 'multi-text', 'file', 'visual-multi', 'visual-single'].includes(field.type) || field.id.includes('notes') || field.id.includes('references');

            fieldsHtml += `
                <div class="field ${isFull ? 'full' : ''} ${isEmpty ? 'is-empty' : ''}">
                  <p class="label">${field.label}</p>
                  ${html}
                </div>
            `;
        });
        
        return `
            <section data-sec-title="${section.title}">
              <div class="sec-head">
                <div class="sec-idx">${index}</div>
                <h2 class="sec-title">${section.title}</h2>
              </div>
              <div class="grid">${fieldsHtml}</div>
              <div class="sec-empty" hidden>Нет заполненных данных</div>
            </section>
        `;
    };

    let visibleSectionIndex = 1;
    const sectionsHtml = sections
        .map(section => {
            if (['summary', 'dynamic_rooms_placeholder'].includes(section.id) || (section.condition && !section.condition(formData, section.id))) {
                return '';
            }
            return renderSection(section, visibleSectionIndex++);
        })
        .join('');

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="ru">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Бриф на дизайн-проект: ${formData.project.address || ''}</title>
      <style>
        :root{
          --brand:#5E0F19; /* фирменный бордовый из стиля Design Essence */
          --text:#1b1b1b;
          --muted:#8c8c8c;
          --bg:#fff;
          --line:#e6e6e6;
          --accent:#111;
          --true-bg:#f0fdf4; --true:#166534;
          --false-bg:#fafafa; --false:#9ca3af; /* максимально нейтрально для «Нет» */
        }
        html,body{margin:0;background:var(--bg);color:var(--text);font:14px/1.55 system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;}

        .page{max-width:960px;margin:24px auto;padding:0 16px 48px;}
        header{border-bottom:1px solid var(--line);padding:20px 0 16px;margin-bottom:12px}
        .brand{font-weight:700;letter-spacing:.02em;font-size:12px;color:var(--brand)}
        h1{font-size:22px;margin:4px 0 2px}
        .subtitle{color:var(--muted);font-size:13px;margin:0}

        .toc{margin:16px 0 24px;padding:12px 14px;border:1px dashed var(--line);border-radius:10px;background:#fafafa}
        .toc-title{font-weight:600;margin:0 0 8px 0;font-size:13px}
        .toc ol{margin:0;padding-left:18px}

        section{margin:18px 0 10px}
        .sec-head{display:flex;gap:10px;align-items:center;margin:0 0 8px}
        .sec-idx{width:22px;height:22px;border:1px solid var(--line);border-radius:6px;display:grid;place-items:center;font-size:12px;color:#666}
        .sec-title{font-weight:700;font-size:16px;margin:0}
        .sec-note{font-size:12px;color:var(--muted);margin-left:auto}
        .sec-empty{font-size:12px;color:var(--muted);margin:6px 0 0 32px;}

        .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:8px}
        .field{border:1px solid var(--line);border-radius:10px;padding:10px 12px;background:#fff; display: flex; flex-direction: column;}
        .field.full{grid-column:1/-1}
        .label{font-size:11px;color:#666;margin:0 0 6px 0}
        .value{font-size:14px; word-break: break-word;}
        .value strong{font-weight:600}

        .value.unfilled{color:#b7b7b7;font-style:italic;font-size:12px}

        .chip{display:inline-block;padding:2px 8px;border-radius:999px;font-size:12px;font-weight:600}
        .chip.true{background:var(--true-bg);color:var(--true)}
        .chip.false{background:var(--false-bg);color:var(--false);font-weight:500}

        .compact .field.is-empty{display:none}
        .compact .sec-empty{display:block}

        .controls{display:flex;gap:8px;align-items:center;margin:8px 0 16px}
        .controls button{border:1px solid var(--line);background:#fff;border-radius:8px;padding:8px 10px;font-size:12px;cursor:pointer}
        .hint{font-size:12px;color:var(--muted)}

        @media print{
          .controls{display:none}
          .toc{page-break-inside:avoid}
          body{background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}
          .page{margin:0;padding:0}
          section{page-break-inside:avoid}
        }
      </style>
    </head>
    <body>
      <div class="page compact" id="page">
        <header>
          <div class="brand">${STUDIO_NAME} — Brief</div>
          <h1>Бриф на дизайн‑проект</h1>
          <p class="subtitle" id="subtitle">${formData.project.address || 'Новый проект'}</p>
          <div class="controls" aria-hidden="true">
            <button id="toggleCompact">Показать все поля</button>
            <span class="hint">Компактный режим скрывает пустые поля и ответы «Нет».</span>
          </div>
        </header>

        <div class="toc" id="toc">
          <p class="toc-title">Оглавление</p>
          <ol></ol>
        </div>

        ${sectionsHtml}

      </div>

      <script>
        (function(){
          const page = document.getElementById('page');
          const toggleBtn = document.getElementById('toggleCompact');

          const toc = document.querySelector('#toc ol');
          document.querySelectorAll('section[data-sec-title]').forEach((sec, idx)=>{
            const title = sec.getAttribute('data-sec-title') || 'Раздел';
            const id = 'sec-' + (idx + 1); 
            sec.id = id;
            const li = document.createElement('li');
            const a = document.createElement('a'); 
            a.textContent = title; 
            a.href = '#' + id;
            li.appendChild(a); 
            toc.appendChild(li);
          });

          function isFieldEmpty(field){
            const v = field.querySelector('.value');
            if(!v) return true;
            const hasUnfilled = v.classList.contains('unfilled');
            const chipFalse = v.querySelector('.chip.false');
            const text = v.textContent.replace(/\\s+/g,'').toLowerCase();
            const emptyText = (text==='' || text==='незаполнено');
            return hasUnfilled || !!chipFalse || emptyText;
          }

          function applyCompact(){
            document.querySelectorAll('section').forEach(sec=>{
              let filledCount = 0;
              sec.querySelectorAll('.field').forEach(f=>{
                const empty = isFieldEmpty(f);
                f.classList.toggle('is-empty', empty);
                if(!empty) filledCount++;
              });
              const note = sec.querySelector('.sec-empty');
              if(note){ note.hidden = filledCount > 0; }
            });
          }

          applyCompact();

          toggleBtn?.addEventListener('click',()=>{
            page.classList.toggle('compact');
            const compactOn = page.classList.contains('compact');
            toggleBtn.textContent = compactOn ? 'Показать все поля' : 'Скрыть пустые поля';
          });
        })();
      </script>
    </body>
    </html>
    `;
    
    const clientName = formData.client.name.trim().split(' ')[0] || 'Client';
    const projectAddress = formData.project.address.trim().replace(/[^a-zA-Z0-9А-Яа-я\s-]/gi, '').replace(/\s+/g, '_') || 'Project';
    const filename = `Бриф_${clientName}_${projectAddress}.html`;

    return htmlContent;
};

export const generateHtml = (formData: IFormData, sections: ISection[]) => {
    const htmlContent = generateHtmlContent(formData, sections);
    
    const clientName = formData.client.name.trim().split(' ')[0] || 'Client';
    const projectAddress = formData.project.address.trim().replace(/[^a-zA-Z0-9А-Яа-я\s-]/gi, '').replace(/\s+/g, '_') || 'Project';
    const filename = `Бриф_${clientName}_${projectAddress}.html`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
};