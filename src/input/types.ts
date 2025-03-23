export type MentionItem<T = Record<PropertyKey, unknown>> = T & {
  display: string;
  id: string;
};

export type MentionOptions = {
  query: RegExp;
  match: RegExp;
};

export type MentionContext = {
  state: {
    input: {
      element: HTMLDivElement | null;
      value: string;
    };

    search: {};

    dropdown: {
      isOpen: boolean;
      position: { top: number; left: number } | null;
    };
  };

  dom: {
    setInputElement: (newInputElement: HTMLDivElement) => void;
  };

  values: {
    getValue: () => string;
    // getTransformedValue: () => string;
    setValue: (text: string) => void;
    getMentionItems: () => MentionItem[]; // Get all mentions in current text
    // serializeMentions: () => Record<string, MentionItem<any>>; // Get mentions as key-value pairs
  };

  handlers: {};

  actions: {
    openDropdown: (node: HTMLElement | Range, value?: string, config?: MentionOptions) => void;
    closeDropdown: () => void;
  };
};
