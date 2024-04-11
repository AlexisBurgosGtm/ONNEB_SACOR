function getView(){
    let view = {
        body:()=>{
            return `
                <div class="col-12 p-0 bg-white">
                    <div class="tab-content" id="myTabHomeContent">
                        <div class="tab-pane fade show active" id="uno" role="tabpanel" aria-labelledby="receta-tab">
                            
                            <div class="row">
                                <div class="col-4">
                                    ${view.vista_grafica_uno()}
                                </div>
                                <div class="col-4">
                                    ${view.vista_grafica_dos()}
                                </div>
                                <div class="col-4">
                                    ${view.vista_grafica_tres()}
                                </div>
                            </div>
                            <br>
                            ${view.parametros()}
                            <div class="row">
                                <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                    ${view.vista_lista_fechas()}
                                </div>
                                <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                    ${view.vista_lista_productos()}
                                </div>
                               
                            </div>
                        </div>
                        
                        <div class="tab-pane fade" id="dos" role="tabpanel" aria-labelledby="home-tab">
                           
                            
                        </div>
                        <div class="tab-pane fade" id="tres" role="tabpanel" aria-labelledby="home-tab">
                            
                        </div>    
                    </div>

                    <ul class="nav nav-tabs hidden" id="myTabHome" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link active negrita text-success" id="tab-uno" data-toggle="tab" href="#uno" role="tab" aria-controls="profile" aria-selected="false">
                                <i class="fal fa-list"></i></a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link negrita text-danger" id="tab-dos" data-toggle="tab" href="#dos" role="tab" aria-controls="home" aria-selected="true">
                                <i class="fal fa-comments"></i></a>
                        </li>  
                        <li class="nav-item">
                            <a class="nav-link negrita text-danger" id="tab-tres" data-toggle="tab" href="#tres" role="tab" aria-controls="home" aria-selected="true">
                                <i class="fal fa-comments"></i></a>
                        </li>         
                    </ul>
                </div>
               
            `
        },
        parametros:()=>{
            return `
            <div class="row">
                <div class="form-group">
                    <label>Seleccione mes y año</label>
                    <div class="input-group">
                        <select class="form-control negrita border-personal text-personal" id="cmbMes"></select>
                        <select class="form-control negrita border-personal text-personal" id="cmbAnio"></select>
                    </div>
                </div>
            </div>
            <br>
            `
        },
        vista_lista_fechas:()=>{
            return `
            <div class="table-responsive col-12">
                <table class="table table-responsive col-12" id="tblFechas">
                    <thead class="bg-personal text-white negrita">
                        <tr>
                            <td>FECHA</td>
                            <td>TOTAL COSTO</td>
                            <td>TOTAL VENTA</td>
                            <td>UTILIDAD</td>
                        </tr>
                    </thead>
                    <tbody id="tblDataFechas">
                    </tbody>
                </table>
            </div>
            `
        },
        vista_lista_productos:()=>{
            return `
            <div class="table-responsive col-12">
                <table class="table table-responsive col-12" id="tblProductos">
                    <thead class="bg-personal text-warning negrita">
                        <tr>
                            <td>PRODUCTO</td>
                            <td>UNIDADES</td>
                            <td>TOTAL COSTO</td>
                            <td>TOTAL VENTA</td>
                            <td>UTILIDAD</td>
                        </tr>
                    </thead>
                    <tbody id="tblDataProductos">
                    </tbody>
                </table>
            </div>
            `
        },
        vista_grafica_uno:()=>{
            return `
            <div class="card card-rounded shadow hand col-12 border-personal">
                <div class="card-body">
                    <label class="negrita">Total Costo:</label>
                    <h4 id="lbTotalCosto" class="text-secondary negrita"></h4>
                </div>
            </div>
            `
        },
        vista_grafica_dos:()=>{
            return `
            <div class="card card-rounded shadow hand col-12 border-personal">
                <div class="card-body">
                    <label class="negrita">Total Venta:</label>
                    <h4 id="lbTotalVenta" class="text-success negrita"></h4>
                </div>
            </div>
            `
        },
        vista_grafica_tres:()=>{
            return `
            <div class="card card-rounded shadow hand col-12 border-personal">
                <div class="card-body">
                    <label class="negrita">Utilidad:</label>
                    <h5 id="lbTotalUtilidad" class="text-danger negrita"></h5>
                </div>
            </div>
            `
        }
    }

    root.innerHTML = view.body();

};


function addListeners(){


    cmbEmpresa.removeEventListener('change', handle_empresa_change)
    cmbEmpresa.addEventListener('change', handle_empresa_change)


    let f = new Date();

    let mes = document.getElementById('cmbMes');
    let anio = document.getElementById('cmbAnio');
    mes.innerHTML = funciones.ComboMeses();
    anio.innerHTML = funciones.ComboAnio();

    mes.value = f.getMonth()+1;
    anio.value = f.getFullYear();

    mes.addEventListener('change',()=>{
        try {
            get_rpt_fechas();
            get_rpt_productos();
        } catch (error) {
            
        }
    })

    anio.addEventListener('change',()=>{
        try {
            get_rpt_fechas();
            get_rpt_productos();
        } catch (error) {
            
        }
    })
 
    get_rpt_fechas();
    get_rpt_productos();

};

function initView(){

    getView();
    addListeners();

};

function handle_empresa_change(){
    get_rpt_fechas();
    get_rpt_productos();
};

function get_rpt_fechas(){
    
    let varTotalCosto = 0;
    let varTotalVenta = 0;
    let varTotalUtilidad = 0;

    let anio = document.getElementById('cmbAnio').value;
    let mes = document.getElementById('cmbMes').value;
    let container = document.getElementById('tblDataFechas')
    container.innerHTML = GlobalLoader;

    let data = {sucursal:cmbEmpresa.value,
                token:TOKEN,
                anio:anio,
                mes:mes}

    GF.get_data_qry('/reportes/rpt_ventas_fechas',data)
    .then((datos)=>{
        let str = '';
        datos.recordset.map((r)=>{
            
            varTotalCosto += Number(r.COSTO);
            varTotalVenta += Number(r.VENTA);
            varTotalUtilidad += Number(r.UTILIDAD);

            let margen = funciones.setMoneda((Number(r.UTILIDAD)/Number(r.VENTA))*100,'')
            str += `
            <tr>
                <td>${funciones.convertDateNormal(r.FECHA)}</td>
                <td>${funciones.setMoneda(r.COSTO,'Q')}</td>
                <td>${funciones.setMoneda(r.VENTA,'Q')}</td>
                <td>${funciones.setMoneda(r.UTILIDAD,'Q')} <small class="text-danger">(${margen})%</small></td>
            </tr>
            `
        })
        container.innerHTML = str;
        document.getElementById('lbTotalCosto').innerText = funciones.setMoneda(varTotalCosto,'Q');
        document.getElementById('lbTotalVenta').innerText = funciones.setMoneda(varTotalVenta,'Q');
        let margen = funciones.setMoneda((Number(varTotalUtilidad)/Number(varTotalVenta))*100,'')
        document.getElementById('lbTotalUtilidad').innerText = `${funciones.setMoneda(varTotalUtilidad,'Q')} (${margen}%)`;
    })
    .catch((error)=>{
        console.log(error);
        document.getElementById('lbTotalCosto').innerText = '---';
        document.getElementById('lbTotalVenta').innerText = '---';
        document.getElementById('lbTotalUtilidad').innerText = '---';
        container.innerHTML = 'No hay datos para mostrar...';
    })


};

function get_rpt_productos(){
    
    let anio = document.getElementById('cmbAnio').value;
    let mes = document.getElementById('cmbMes').value;
    let container = document.getElementById('tblDataProductos')
    container.innerHTML = GlobalLoader;

    let data = {sucursal:cmbEmpresa.value,
                token:TOKEN,
                anio:anio,
                mes:mes}

    GF.get_data_qry('/reportes/rpt_ventas_productos',data)
    .then((datos)=>{
        let str = '';
        datos.recordset.map((r)=>{
            
            let margen = funciones.setMoneda(((Number(r.VENTA)-Number(r.COSTO))/Number(r.VENTA))*100,'')
            str += `
            <tr>
                <td>${r.DESPROD}</td>
                <td>${r.UNIDADES}</td>
                <td>${funciones.setMoneda(r.COSTO,'Q')}</td>
                <td>${funciones.setMoneda(r.VENTA,'Q')}</td>
                <td>${funciones.setMoneda(Number(r.VENTA)-Number(r.COSTO),'Q')} <small class="text-danger">(${margen})%</small></td>
            </tr>
            `
        })
        container.innerHTML = str;
    })
    .catch((error)=>{
        container.innerHTML = 'No hay datos para mostrar...';
    })


};