// Data: 30/05/2025

// Inicialização do QuaggaJS
Quagga.init({
    inputStream : {
        name : "Live",
        type : "LiveStream",
        target: document.querySelector('#interactive')
    },
    decoder : {
        readers : ["ean_reader", "upc_reader", "code_128_reader"]
    }
}, function(err) {
    if (err) {
        console.error("Erro ao inicializar Quagga:", err);
        return;
    }
    console.log("Quagga inicializado. Pronto para iniciar.");
    Quagga.start();
});

// Evento quando um código de barras é detectado
Quagga.onDetected(function(result) {
    var code = result.codeResult.code;
    document.querySelector('#result').textContent = 'Código detectado: ' + code;
    console.log("Código detectado:", code);
    Quagga.stop(); // Para de ler após o primeiro código detectado
    // Aqui você pode adicionar lógica adicional, como enviar o código para um servidor, etc.
});

// Evento de processamento (para depuração e visualização)
Quagga.onProcessed(function(result) {
    var drawingCtx = Quagga.canvas.ctx.overlay;
    var drawingCanvas = Quagga.canvas.dom.overlay;

    if (result) {
        if (result.boxes) {
            drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.width), parseInt(drawingCanvas.height));
            result.boxes.filter(function (box) {
                return box !== result.box;
            }).forEach(function (box) {
                Quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, drawingCtx, {color: "green", lineWidth: 2});
            });
        }

        if (result.box) {
            Quagga.ImageDebug.drawPath(result.box, {x: 0, y: 1}, drawingCtx, {color: "#00F", lineWidth: 2});
        }

        if (result.codeResult && result.codeResult.code) {
            Quagga.ImageDebug.drawPath(result.line, {x: 'x', y: 'y'}, drawingCtx, {color: "red", lineWidth: 3});
        }
    }
});