import { createSignal, type Component } from 'solid-js'
import logo from './logo.svg'
import styles from './App.module.css'
import { MentionsInput } from 'src'

const App: Component = () => {
  const [value, setValue] = createSignal('Hello @user and #team!')

  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <img src={logo} class={styles.logo} alt="logo" />
        <MentionsInput
          value={value()}
          onChange={value => setValue(value)}
          triggers={[
            { trigger: '@', name: 'at-mention' },
            { trigger: '#', name: 'hash-mention' },
          ]}
          autoFocus
        />
      </header>
    </div>
  )
}

export default App
