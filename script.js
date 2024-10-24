// Seleciona os elementos do formulário.
const form = document.querySelector('form')
const amount = document.getElementById('amount')
const expense = document.getElementById('expense')
const category = document.getElementById('category')

// Seleciona os elementos da lista
const expenseList = document.querySelector("ul")
const expensesTotal = document.querySelector("aside header h2")
const expensesQuantity = document.querySelector("aside header p span")

// Captura o evento de input para formatar o valor.
amount.oninput = () => {
// Obtém o valor atual do input e remove os caracteres não numéricos.
    let value = amount.value.replace(/\D/g, '')

// Transformar o valor em centavos. (exemplo 150/100 = 1.5 que é eqivalente a R$ 1,50)
value = Number(value) / 100

// Atualiza o valor do input
    amount.value = formatCurrencyBRL(value)
}

function formatCurrencyBRL(value){
    // Formata o valor do padrão BRL (Real Brasileiro)
    value = value.toLocaleString('pt-br', {
        style: 'currency',
        currency: 'BRL'
    })
// Retorna o valor formatado.
    return value
}

// Captura o evento de submit do formulário para obter os valores.
form.onsubmit = (event) => {
// Previne o recaregamento da página.
    event.preventDefault()   
    const newExpense = {
        id : new Date().getTime(),
        expense: expense.value, 
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        created_at: new Date(),
    }

// Chama a função que irá adicionar o item na lista.
    expenseAdd(newExpense)
}

// Adiciona um novo item na lista.

function expenseAdd(newExpense){
    try {
// Cria o elemento de li para adicionar o item na lista. (ul)
        const expenseItem = document.createElement('li')
        expenseItem.classList.add('expense')
// Cria o ícone da categoria.
        const expenseIcon = document.createElement('img')
        expenseIcon.setAttribute('src', `img/${newExpense.category_id}.svg`)
        expenseIcon.setAttribute('alt', newExpense.category_name)

// Cria a info da despesa.
const expenseInfo = document.createElement("div")
expenseInfo.classList.add("expense-info")

// Cria o nome da despesa.
const expenseName= document.createElement("strong")
expenseName.textContent = newExpense.expense

// Cria a categoria da despesa.
const expenseCategory = document.createElement("span")
expenseCategory.textContent = newExpense.category_name

// Adiciona nome e categoria na div das informações da despesa.
expenseInfo.append(expenseName, expenseCategory)

// Cria a info de quantidade.
const expenseAmount = document.createElement("span")
expenseAmount.classList.add("expense-amount")
expenseAmount.innerHTML = `<span><small>R$</small>${newExpense.amount.toUpperCase().replace("R$", "")}</span>`

// Botão de remover a despesa.
const removeIcon = document.createElement("img")
removeIcon.classList.add("remove-icon")
removeIcon.setAttribute("src", "img/remove.svg")
removeIcon.setAttribute("alt", "remover")

// Icone de adicionar recibo.
const receiptIcon = document.createElement("label")
receiptIcon.classList.add("receipt-icon")
receiptIcon.setAttribute("for", "receipt-icon")
receiptIcon.innerHTML = `<img class="receipt-icon" src="img/receipt-alt.svg"/>`

// Botão de adicionar recibo.
const receiptInput = document.createElement("input")
receiptInput.classList.add("receipt-icon")
receiptInput.setAttribute("alt", "incluir comprovante")
receiptInput.setAttribute("type", "file")
receiptInput.setAttribute("id", "receipt-icon")

// Adiciona o botão no icone.
receiptIcon.append(receiptInput)

// Adiciona as informações no item.
expenseItem.append(expenseIcon, expenseInfo, expenseAmount, receiptIcon, removeIcon)

// Adiciona o item na lista
expenseList.append(expenseItem)

// Limpa o formulário após adicionar um item.
inputclear()

// Adiciona a função totais 
updateTotals()

    } catch (error) {
        alert('Não foi possível atualizar a lista de despesas.')
    }
}

// Atualiza os totais.
function updateTotals() {
    try {
// Recupera todos os itens (li) da lista (ul)
        const items = expenseList.children

// Atualiza a quantidade de itens da lista.
        expensesQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`
        
// Variável para incrementar o total.
        let total = 0

// Percorre cada item (li) da lista (ul)
        for(let item = 0; item < items.length; item++){
        const itemAmount = items[item].querySelector(".expense-amount")

// Remove caracteres não numéricos e substitui a vírgula e ponto.
        let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",", ".")
        
// Converte o valor para float.
        value = parseFloat(value)

// Verifica se é um número válido
        if (isNaN(value)) {
            return alert("Não foi possível calcular o total. O valor não parece ser um número.")
        }

// Incrementar o valor total
        total += Number(value)
        }
// Cria a span para adicionar o R$ formatado.
        const symbolBRL= document.createElement("small")
        symbolBRL.textContent = "R$"

// Formata o valor e remove o R$ que será exibido pela small com um estilo customizado.
        total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")

// Limpa o conteúdo do elemento.
        expensesTotal.innerHTML = ""

// Adiciona o símbolo da moeda e o valor.
        expensesTotal.append(symbolBRL, total)
    } catch (error) {
        console.log(error)
        alert("Não foi possível atualizar os totais.")
    }
}

// Evento que captura o clique nos itens da lista.
expenseList.addEventListener("click", (event) => {

    // Verificar se o item clicado é o icone de remover.
    if(event.target.classList.contains("remove-icon")) {

    // Obtem a li pai do elemento clicado.
    const item = event.target.closest(".expense")

    // Remove item da lista.
    item.remove()
    }
    // Atualiza os totais.
    updateTotals()
})

function inputclear(){
    // Limpa os inputs.
    expense.value=""
    category.value=""
    amount.value=""
    
    // Foca no começo novamente.
    expense.focus()
}