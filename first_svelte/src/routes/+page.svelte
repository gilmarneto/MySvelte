<!-- JS -->
<script>
    // Variáveis
    let numero = 0
    // Função decremento
    function decremento() {
        numero -= 1
    }
    // Função reset
    function reset() {
        numero = 0
    }
    // Função incremento
    function incremento() {
        numero += 1
    }
</script>

<!-- HTML -->
<h1>Contador</h1>
<div><h2>{numero}</h2></div>
<button on:click={decremento}>-1</button>
<button on:click={reset}>reset</button>
<button on:click={incremento}>+1</button>