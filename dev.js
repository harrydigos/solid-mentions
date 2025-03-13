import { createComponent, insert, template } from 'solid-js/web';
import { createEffect, For, Show } from 'solid-js';
import { ContentEditable } from '@bigmistqke/solid-contenteditable';

// src/index.tsx
var _tmpl$ = /* @__PURE__ */ template(`<span role=button>`);
function MentionsInput(props) {
  let editorRef;
  createEffect(() => {
    if (props.autoFocus && editorRef) {
      editorRef.focus();
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(editorRef);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  });
  return createComponent(ContentEditable, {
    ref(r$) {
      var _ref$ = editorRef;
      typeof _ref$ === "function" ? _ref$(r$) : editorRef = r$;
    },
    get textContent() {
      return props.value;
    },
    onTextContent: (value) => {
      props.onChange(value);
      console.log("triggered change", {
        value
      });
    },
    get ["class"]() {
      return props.class;
    },
    role: "textbox",
    get ["aria-multiline"]() {
      return props.multiline;
    },
    "aria-haspopup": "listbox",
    "aria-invalid": "false",
    "aria-autocomplete": "list",
    get contentEditable() {
      return !props.disabled;
    },
    get singleline() {
      return !props.multiline;
    },
    onClick: (event) => {
      if (!event.target.matches('span[role="button"]')) {
        return;
      }
      console.log("clicked mention", event.target);
      event.preventDefault();
    },
    render: (textContent) => createComponent(For, {
      get each() {
        return textContent().split("\n");
      },
      children: (line, lineIndex) => {
        const isLastLine = () => textContent().split("\n").length - 1 === lineIndex();
        return [createComponent(For, {
          get each() {
            return line.split(" ");
          },
          children: (word, wordIndex) => {
            const isLastWord = () => line.split(" ").length - 1 === wordIndex();
            return [createComponent(Show, {
              get when() {
                return props.triggers.some((t) => word.startsWith(t.trigger));
              },
              fallback: word,
              get children() {
                var _el$ = _tmpl$();
                _el$.style.setProperty("cursor", "pointer");
                _el$.style.setProperty("border-radius", "2px");
                _el$.style.setProperty("background-color", "blue");
                _el$.style.setProperty("color", "white");
                insert(_el$, word);
                return _el$;
              }
            }), createComponent(Show, {
              get when() {
                return !isLastWord();
              },
              children: " "
            })];
          }
        }), createComponent(Show, {
          get when() {
            return !isLastLine();
          },
          children: "\n"
        })];
      }
    })
  });
}

export { MentionsInput };
