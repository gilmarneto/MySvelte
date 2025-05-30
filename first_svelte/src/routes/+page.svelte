<script>
    import { onMount, onDestroy } from 'svelte';
    // Importe a variável 'browser' do SvelteKit para verificar o ambiente
    import { browser } from '$app/environment';
    import Quagga from 'quagga'; // Certifique-se de ter instalado: npm install quagga

    // --- Variáveis e Lógica do Scanner ---
    let resultText = 'Aguardando leitura...';
    let interactiveElement; // Para referenciar o div onde o vídeo será exibido

    // Quando o componente é montado no DOM
    onMount(() => {
        // **IMPORTANTE: Verifique se está no navegador antes de inicializar Quagga**
        if (browser) {
            Quagga.init({
                inputStream : {
                    name : "Live",
                    type : "LiveStream",
                    target: interactiveElement, // Referencia o elemento Svelte
                    constraints: {
                        facingMode: "environment" // Usa a câmera traseira, se disponível
                    }
                },
                decoder : {
                    readers : ["ean_reader", "upc_reader", "code_128_reader"] // Tipos de códigos que você quer ler
                }
            }, function(err) {
                if (err) {
                    console.error("Erro ao inicializar Quagga:", err);
                    resultText = 'Erro ao iniciar câmera. Verifique o console.';
                    return;
                }
                console.log("Quagga inicializado. Pronto para iniciar");
                Quagga.start();
            });

            // Evento quando um código de barras é detectado
            Quagga.onDetected(function(result) {
                const code = result.codeResult.code;
                resultText = 'Código detectado: ' + code;
                console.log("Código detectado:", code);
                Quagga.stop(); // Para de ler após o primeiro código detectado
            });

            // Evento de processamento (para depuração visual)
            Quagga.onProcessed(function(result) {
                if (Quagga.canvas && Quagga.canvas.ctx && Quagga.canvas.dom) {
                    const drawingCtx = Quagga.canvas.ctx.overlay;
                    const drawingCanvas = Quagga.canvas.dom.overlay;

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
                }
            });
        } // Fim do 'if (browser)'
    });

    // Quando o componente é destruído (navegação, etc.)
    onDestroy(() => {
        // **IMPORTANTE: Pare Quagga apenas se estiver no navegador e ele foi inicializado**
        if (browser && Quagga && typeof Quagga.stop === 'function') {
            Quagga.stop();
            console.log("Quagga parado e recursos liberados.");
        }
    });

    // --- Variáveis e Lógica do Contador (não precisam de 'if (browser)') ---
    let numero = 0;

    function decremento() {
        numero -= 1;
    }

    function reset() {
        numero = 0;
    }

    function incremento() {
        numero += 1;
    }
</script>

<style>
    /* --- Estilos para o Scanner --- */
    .scanner-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 2em;
    }

    .viewport {
        position: relative;
        width: 100%;
        max-width: 600px; /* Adapte conforme necessário */
        height: auto;
        overflow: hidden;
        border: 2px solid #007bff; /* Borda destacada */
        border-radius: 8px;
        margin-bottom: 1em;
        background-color: #000; /* Fundo escuro para o vídeo */
    }
    /* Removi os seletores .viewport canvas e .viewport video do CSS porque o Svelte já te avisou que são unused, pois os elementos de vídeo/canvas são injetados pelo Quagga JS e não são declarados diretamente no seu HTML Svelte. O Quagga já cuida dos estilos inline para eles. */

    .result-display {
        font-size: 1.2em;
        font-weight: bold;
        color: #333;
    }

    /* --- Estilos para o Contador --- */
    .counter-container {
        text-align: center;
        padding: 20px;
        border: 1px solid #eee;
        border-radius: 8px;
        background-color: #f9f9f9;
    }

    .counter-display {
        font-size: 2.5em;
        font-weight: bold;
        color: #28a745;
        margin-bottom: 15px;
    }

    button {
        padding: 10px 20px;
        margin: 0 10px;
        border: none;
        border-radius: 5px;
        background-color: #007bff;
        color: white;
        font-size: 1em;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    button:hover {
        background-color: #0056b3;
    }

    button:active {
        background-color: #004085;
    }

    /* --- Estilos Globais (opcional) --- */
    main {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        padding: 20px;
        max-width: 800px;
        margin: 20px auto;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        border-radius: 10px;
        background-color: #fff;
    }
    h1, h2 {
        color: #343a40;
        text-align: center;
        margin-bottom: 1em;
    }
    hr {
        border: 0;
        border-top: 1px dashed #ddd;
        margin: 3em 0;
    }
</style>

<main>
    <h1>Aplicação de Leitura e Contagem</h1>

    <div class="scanner-container">
        <h2>Leitor de Código de Barras</h2>
        <div bind:this={interactiveElement} class="viewport"></div>
        <p class="result-display">{resultText}</p>
    </div>

    <hr>

    <div class="counter-container">
        <h2>Contador</h2>
        <div class="counter-display">{numero}</div>
        <button on:click={decremento}>-1</button>
        <button on:click={reset}>Reset</button>
        <button on:click={incremento}>+1</button>
    </div>
</main>