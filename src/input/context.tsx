import { Accessor, JSX, Setter, createContext, createSignal, useContext } from 'solid-js';

export const MyContext = createContext<{
  popover: {
    isOpen: Accessor<boolean>;
    position: Accessor<{ top: number; left: number }>;
  };
  actions: {
    popover: {
      setIsOpen: Setter<boolean>;
      setPosition: Setter<{ top: number; left: number }>;
    };
  };
}>();

export function Provider(props: { children: JSX.Element }) {
  const [showPopover, setShowPopover] = createSignal(false);
  const [popoverPosition, setPopoverPosition] = createSignal({ top: 0, left: 0 });

  return (
    <MyContext.Provider
      value={{
        popover: {
          isOpen: showPopover,
          position: popoverPosition,
        },
        actions: {
          popover: {
            setIsOpen: setShowPopover,
            setPosition: setPopoverPosition,
          },
        },
      }}
    >
      {props.children}
    </MyContext.Provider>
  );
}

export function useMyContext() {
  const value = useContext(MyContext);

  if (!value) {
    throw new Error('Missing context Provider');
  }

  return value;
}
