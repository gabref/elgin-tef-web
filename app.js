const BASE_URL = 'http://localhost:2001/tef/v1'

const vendas = []

function start() {
    window.location.href = "intent://connect/start"
}

function stop() {
    window.location.href = "intent://connect/stop"
}

function configuracao() {
    sendPost('/configuracao', {
        nome: "nome teste",
        versao: "0.0.1",
        textoPinpad: "teste texto",
        macPinpad: "",
        producao: "0",
        estabelecimento: "estabelecimento teste",
        terminal: "000000",
        loja: ""
    })
}

function ativacao() {
    sendPost('/ativacao', {
        cnpjCpf: "14.200.166/0001-66"
    })
}

async function reimpressao() {
    const venda = await sendGet('/adm/reimpressao')
    vendas.push[venda]
}

function relatorio() {
    sendGet('/adm/relatorio')
}

function venda() {
    sendPost('/venda', null)
}

function debito() {
    sendPost('/venda/debito', {
        valor: "1.00"
    })
}

function credito() {
    const venda = sendPost('/venda/credito', {
        valor: "1.00",
        parcelas: "1",
        financiamento: "1"
    })

    vendas.push(venda)
}

function cancelamento() {
    sendPost('/adm/cancelamento', {
        valor: "1.00",
        nsu: "000000",
        data: "01/09/22"
    })
}

async function sendGet(rota) {
    try {
        const responseData = await fetch(BASE_URL + rota, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "GET"
        })
        const data = await responseData.json()

        console.log('data json get', data)
        alert(JSON.stringify(data))

        return data
    } catch (err) {
        console.error(err)
        alert(err)
    }
}

async function sendPost(rota, body) {
    try {
        const responseData = await fetch(BASE_URL + rota, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(body)
        })
        const dataJson = await responseData.json()
        
        dataJson.resultado = await dataJson.resultado.json()

        console.log('json', dataJson)
        alert(JSON.stringify(dataJson))

        return dataJson

    } catch (err) {
        console.error('error: ', err)
        alert(err)
    }
}