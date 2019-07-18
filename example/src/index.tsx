import Yaf, { Reactive, Component } from '../../dist/yaf'

@Component()
class MyComponent {
  public counter = 0;
  public welcomeText = '';
  public isVisible = true;
  
  constructor() {
  }

  updateWelcomeText(newValue) {
    this.welcomeText = newValue;
  }

  countUp() {
    this.counter += 1;
  }

  countDown() {
    this.counter -= 1;
  }

  toggle() {
    this.isVisible = !this.isVisible;
  }

  render() {
    const test = this.isVisible ? <span>isVisible</span> : null;
    return <div>
      <input onInput={($event) => this.updateWelcomeText($event.target.value)}></input>
      <h3>{this.welcomeText}</h3>
      <button onClick={() => this.countDown()}>-</button>
      <span>{this.counter}</span>
      <button onClick={() => this.countUp()}>+</button>
      <div>
        <button onClick={() => this.toggle()}>Toggle</button>
        {test}
      </div>
    </div>
  }
}

class App {
  render() {
    return <MyComponent></MyComponent>
  }
}

const entry = document.querySelector('#app');
Yaf.render(<App></App>, entry);
