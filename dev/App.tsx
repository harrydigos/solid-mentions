import { createSignal, type Component } from 'solid-js';
import styles from './App.module.css';
import { MentionsInput, MentionsInput2 } from 'src';

const App: Component = () => {
  const [value, setValue] = createSignal('Hello @user and #team!');

  return (
    <div class={styles.content}>
      <MentionsInput
        value={value()}
        onChange={(value) => setValue(value)}
        triggers={[
          { trigger: '@', name: 'at-mention' },
          { trigger: '#', name: 'hash-mention' },
        ]}
        autoFocus
        class={styles.mentionsInput}
        multiline // ={false}
      />

      <MentionsInput2 class={styles.mentionsInput} />
    </div>
  );
};

export default App;
