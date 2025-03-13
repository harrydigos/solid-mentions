import * as solid_js from 'solid-js';
import { ComponentProps } from 'solid-js';

type TriggerConfig = {
    /**
     * The character(s) that trigger mention suggestions
     * (e.g. '@', '#', or ':')
     */
    trigger: string;
    name?: string;
};
type MentionsInputProps = {
    value: string;
    onChange: (value: string) => void;
    triggers: Array<TriggerConfig>;
    autoFocus?: boolean;
    disabled?: boolean;
    multiline?: boolean;
} & Pick<ComponentProps<'div'>, 'class'>;
declare function MentionsInput(props: MentionsInputProps): solid_js.JSX.Element;

export { MentionsInput, type MentionsInputProps, type TriggerConfig };
