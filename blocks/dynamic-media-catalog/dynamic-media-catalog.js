

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

        const jsonConfigParams = Object.keys(jsonConfig.data[0]);
        const DMParams = jsonConfigParams.filter(function (param) {
            return param.startsWith('$');
        });

        var DMParamInfoHTML = '';

        DMParams.forEach(function(param) {
            DMParamInfoHTML += jsx `
            <span class="badge text-bg-light fs-6">${param}</span>
            `; 
        });

        const templateURL = jsonConfig.data[0].template_url;

        const infoHTML = jsx `

        <div class="col-12 mt-5">
            <div class="row">
                <div class="col-3">
                    <div class="card">
                        <div class="card-header text-center">
                            Template
                        </div>
                        <img src="${templateURL}" class="img-fluid">
                    </div>
                </div>
                <div class="col-5">
                    <div class="card">
                        <div class="card-header text-center">
                            Template Parameters
                        </div>
                        <div class="card-body">
                            ${DMParamInfoHTML}

                            <div class="alert alert-success mt-4 mb-0 p-2" role="alert">
                                Reading Dynamic Media variables from <a target="_blank" href="${path}">HERE</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;

        finalHTML += infoHTML;

        jsonConfig.data.map(function(item, index){
            var timestamp = index;
            var DMLink = '';
            var DMLinkParams = '';
            var DMLinkPreviewParams = '';

            for (const property in item) {
                if(property=='template_url') {
                    DMLink = item[property] + '?';
                } else {
                    if(property!='wid') {
                        DMLinkPreviewParams += `&${property}=${encodeURIComponent(item[property])}`;
                    }

                    DMLinkParams += `&${property}=${encodeURIComponent(item[property])}`;
                }
                
            }

            finalHTML += jsx`
            <div class="col-4">
                <div class="card">
                    <img src="${DMLink + DMLinkParams}" role="button" data-bs-toggle="modal" data-bs-target="#${timestamp}" alt="">
                    <div class="card-body">
                        <div class="input-group mb-3">
                            <span class="input-group-text">Image URL</span>
                            <input type="text" value="${DMLink + DMLinkParams}" readonly class="form-control" placeholder="image url" aria-label="image url">
                            <button class="btn btn-primary" type="button" onclick="navigator.clipboard.writeText('${DMLink + DMLinkParams}')">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-copy" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal fade" id="${timestamp}" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-xl">
                    <img src="${DMLink + DMLinkPreviewParams}" class="mx-auto d-block" alt="" />
                </div>
            </div>
            `;
        })

        block.classList.add('row', 'gy-3');
        block.innerHTML = finalHTML;
    }
  }
  