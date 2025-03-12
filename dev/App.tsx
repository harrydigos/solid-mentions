import type { Component } from 'solid-js'
import logo from './logo.svg'
import styles from './App.module.css'
import { MentionsInput } from 'src'

const App: Component = () => {
  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <img src={logo} class={styles.logo} alt="logo" />
        <MentionsInput
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
