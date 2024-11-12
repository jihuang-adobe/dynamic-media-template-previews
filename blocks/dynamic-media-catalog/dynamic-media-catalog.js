export function jsx(html, ...args) {
    return html.slice(1).reduce((str, elem, i) => str + args[i] + elem, html[0]);
}

export async function loadConfig(path) {
    const resp = await fetch(path);
    return await resp.json();
}

export default async function decorate(block) {
    const pathElement = block.querySelector('a');

    if(pathElement) {
        var finalHTML = '';
        const path = pathElement.textContent;

        const jsonConfig  = await loadConfig(path);

        finalHTML += jsx `
        <div class="alert alert-success mt-5" role="alert">
        Reading Dynamic Media variables from <a href="${path}">HERE</a>
        </div>
        `;

        jsonConfig.data.map(function(item){
            var DMLink = '';
            var DMLinkParams = '';

            for (const property in item) {
                if(property=='$template_url') {
                    DMLink = item[property] + '?';
                } else {
                    DMLinkParams += `&${property}=${encodeURIComponent(item[property])}`;
                }
                
            }

            finalHTML += jsx`
            <div class="col-4">
                <div class="card">
                    <img src="${DMLink + DMLinkParams}" class="card-img-top" alt="">
                    <div class="card-body">
                        <input class="form-control" type="text" value="${DMLink + DMLinkParams}" aria-label="readonly input example" readonly>
                        </br>
                        <a href="#" onclick="navigator.clipboard.writeText('${DMLink + DMLinkParams}')" class="btn btn-primary">Copy</a>
                    </div>
                </div>
            </div>
            `;
            console.log(item);
        })

        block.classList.add('row', 'gy-3');
        block.innerHTML = finalHTML;

        /*
        block.innerHTML = jsx`
            <picture>
            <source type="image/webp" srcset="${link}?$rfk_medium$">
            <img class="s7" loading="lazy" alt="..." src="${link}?$rfk_medium$">
            </picture>
        `;
        */
    }
  }
  