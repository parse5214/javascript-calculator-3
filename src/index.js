import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'


const idsAndValues = [
  {id: "zero", value: "0"},
  {id: "one", value: "1"},
  {id: "two", value: "2"},
  {id: "three", value: "3"},
  {id: "four", value: "4"},
  {id: "five", value: "5"},
  {id: "six", value: "6"},
  {id: "seven", value: "7"},
  {id: "eight", value: "8"},
  {id: "nine", value: "9"},
  {id: "equals", value: "="},
  {id: "add", value: "+"},
  {id: "subtract", value: "-"},
  {id: "multiply", value: "*"},
  {id: "divide", value: "/"},
  {id: "decimal", value: "."},
  {id: "clear", value: "C"}
]

const DisplayArea = (props) => {
  return (
    <div className="dArea">
      <div className="dExpression">{props.expression}</div>
      <div className="dInput" id="display">{props.input}</div>
    </div>
  )
}

const PadButtons = (props) => {
  return (
    <div className="padButton" id={props.id} onClick={() => props.handleClick(props.value)}>
      {props.value}
    </div>
  )
}

class App extends React.Component {
  constructor() {
    super()

    this.state = {
      data: idsAndValues,
      expression: [],
      input: ['0'],
    }

    this.clearState = this.clearState.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleDigits = this.handleDigits.bind(this)
    this.handleOperators = this.handleOperators.bind(this)
    this.handleEqual = this.handleEqual.bind(this)

  }

  clearState() {
    return this.setState(() => {
      return {input: ['0'], expression: []}
    })
  }

  handleClick(symbol) {
    if(/C/.test(symbol)) this.clearState()
    else if(/=/.test(symbol)) this.handleEqual()
    else if(/[+*/-]/.test(symbol)) this.handleOperators(symbol)
    else this.handleDigits(symbol)
  }

  handleDigits(symbol) {
    return this.setState(prev => {
      const prevInput = prev.input
      const prevExpre = prev.expression
      if(prevInput.length === 1 && prevInput[0] === '0') {
        if(symbol === '0') console.log("Error: the input is already zero")
        else if(symbol === '.') {
          prevInput.push(symbol)
          return {input: prevInput}
        }else return {input: [symbol]}
      }else if(/[+*/-]/.test(prevInput)){
        prevExpre.push(...prevInput)
        return {input: [symbol], expression: prevExpre}
      }else if(/\./.test(prevInput.join(''))) {
        if(symbol === '.') console.log("Error: The number is already decimal")
        else {
          prevInput.push(symbol)
          return {input: prevInput}
        }
      }else {
        prevInput.push(symbol)
        return {input: prevInput}
      }
    })
  }

  handleOperators(symbol) {
    return this.setState(prev => {
      const prevInput = prev.input
      const prevExpre = prev.expression
      if(/\d/.test(prevInput)) {
        if(/=/.test(prevExpre[prevExpre.length-1])) {
          return {input: [symbol], expression: [prevInput.join('')]}
        }else if(prevInput.length === 1 && prevInput[0] === '0') {
          if(symbol === '-') return {input: [symbol]}
          else console.log("Error: Number is zero")
        }else {
          prevExpre.push(prevInput.join(''))
          return {input: [symbol], expression: prevExpre}
        }
      }else if(/[+*/-]/.test(prevInput[prevInput.length-1])) {
        if(symbol === '-') {
          if(/-/.test(prevInput[prevInput.length-1])) console.log("Error: Already negative")
          else {
            prevInput.push(symbol)
            return {input: prevInput}
          }
        }else return {input: [symbol]}
      }else {
        prevExpre.push(prevInput.join(''))
        return {input: [symbol], expression: prevExpre}
      }
    })
  }

  handleEqual() {
    this.setState(prev => {
      const prevInput = prev.input
      const prevExpre = prev.expression
      if(/\d/.test(prevInput[prevInput.length-1])) {
        prevExpre.push(prevInput.join(''))
        return {input: [], expression: prevExpre}
      }else return {input: [], expression: prevExpre}
    })

    return this.setState(prev => {
      const prevExpre = prev.expression
      const result = prevExpre.reduce((acc, el) => {
        if(acc.length > 0) {
          let last = acc[acc.length-1]
          if(last === '-') {
            acc.pop()
            acc.push(-el)
            return acc
          }else {
            acc.push(el)
            return acc
          }
        }
        acc.push(el)
        return acc
      },[])
      .reduce((acc, el) => {
        if(acc.length > 1) {
          let prev = acc[acc.length-2]
          let last = acc[acc.length-1]
          if(last === '/' || last === '*') {
            acc.pop()
            acc.pop()
            if(last === '*') acc.push(prev*el)
            else acc.push(prev/el)
            return acc
          }else {
            acc.push(el)
            return acc
          }
        }
        acc.push(el)
        return acc
      }, [])
      .reduce((acc, el) => {
        if(/\d/.test(el)) acc += Number(el)
        return acc
      }, 0)

      console.log(prevExpre)
      prevExpre.push('=')
      return {input: [result], expression: prevExpre}
    })
  }

  render() {
    const buttons = this.state.data.map(el => <PadButtons id={el.id} handleClick={this.handleClick} value={el.value} />)
    return (
      <div className="app">
        <DisplayArea expression={this.state.expression} input={this.state.input}/>
        {buttons}
      </div>
    )
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App />)