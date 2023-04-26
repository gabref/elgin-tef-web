const BASE_URL = 'http://localhost:2001/tef/v1'

const historicoVendas = []

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
    sendGet('/adm/reimpressao')
}

function relatorio() {
    sendGet('/adm/relatorio')
}

async function venda() {
    const venda = await sendPost('/venda', null)

    if (venda.resultado.data !== undefined)
        historicoVendas.push(venda)
}

async function debito() {
    const venda = await sendPost('/venda/debito', {
        valor: "1.00"
    })

    if (venda.resultado.data !== undefined)
        historicoVendas.push(venda)
}

async function credito() {
    const venda = await sendPost('/venda/credito', {
        valor: "1.00",
        parcelas: "1",
        financiamento: "1"
    })

    if (venda.resultado.data !== undefined)
        historicoVendas.push(venda)
}

async function cancelamento() {
    const ultimaVenda = historicoVendas.pop()
    if (ultimaVenda === undefined) return

    const valor = ultimaVenda.resultado.valor
    const nsu = ultimaVenda.resultado.nsu
    const data = ultimaVenda.resultado.data.split(' ')[0]

    console.log('dados resgatados', {valor, nsu, data })

    const cancelamentoResponse = await sendPost('/adm/cancelamento', {
        valor: '1.00',
        nsu: nsu,
        data: '26/04/23'
    })

    if (cancelamentoResponse.resultado.mensagem.indexOf('CANCELADA') !== -1)
        historicoVendas.push(cancelamentoResponse)

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
        
        dataJson.resultado = JSON.parse(dataJson.resultado)

        console.log('json', dataJson)
        alert(JSON.stringify(dataJson))

        return dataJson

    } catch (err) {
        console.error('error: ', err)
        alert(err)
    }
}
