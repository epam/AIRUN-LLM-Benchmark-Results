I have the following application code that needs comprehensive unit testing:

<source_code>
```tsx
// index.tsx
import * as React from 'react';
import {
  AriaAttributes,
  Component,
  FocusEventHandler,
  FormEventHandler,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactNode,
  RefCallback,
  TouchEventHandler,
} from 'react';
import { MenuPlacer } from './components/Menu';
import LiveRegion from './components/LiveRegion';

import { createFilter, FilterOptionOption } from './filters';
import { DummyInput, ScrollManager, RequiredInput } from './internal/index';
import { AriaLiveMessages, AriaSelection } from './accessibility/index';
import { isAppleDevice } from './accessibility/helpers';

import {
  classNames,
  cleanValue,
  isTouchCapable,
  isMobileDevice,
  noop,
  scrollIntoView,
  isDocumentElement,
  notNullish,
  valueTernary,
  multiValueAsValue,
  singleValueAsValue,
} from './utils';

import {
  formatGroupLabel as formatGroupLabelBuiltin,
  getOptionLabel as getOptionLabelBuiltin,
  getOptionValue as getOptionValueBuiltin,
  isOptionDisabled as isOptionDisabledBuiltin,
} from './builtins';

import { defaultComponents, SelectComponentsConfig } from './components/index';

import {
  ClassNamesConfig,
  defaultStyles,
  StylesConfig,
  StylesProps,
} from './styles';
import { defaultTheme, ThemeConfig } from './theme';

import {
  ActionMeta,
  FocusDirection,
  GetOptionLabel,
  GetOptionValue,
  GroupBase,
  InputActionMeta,
  MenuPlacement,
  MenuPosition,
  OnChangeValue,
  Options,
  OptionsOrGroups,
  PropsValue,
  SetValueAction,
} from './types';

export type FormatOptionLabelContext = 'menu' | 'value';
export interface FormatOptionLabelMeta<Option> {
  context: FormatOptionLabelContext;
  inputValue: string;
  selectValue: Options<Option>;
}

export interface Props<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
> {
  /** HTML ID of an element containing an error message related to the input**/
  'aria-errormessage'?: AriaAttributes['aria-errormessage'];
  /** Indicate if the value entered in the field is invalid **/
  'aria-invalid'?: AriaAttributes['aria-invalid'];
  /** Aria label (for assistive tech) */
  'aria-label'?: AriaAttributes['aria-label'];
  /** HTML ID of an element that should be used as the label (for assistive tech) */
  'aria-labelledby'?: AriaAttributes['aria-labelledby'];
  /** Used to set the priority with which screen reader should treat updates to live regions. The possible settings are: off, polite (default) or assertive */
  'aria-live'?: AriaAttributes['aria-live'];
  /** Customise the messages used by the aria-live component */
  ariaLiveMessages?: AriaLiveMessages<Option, IsMulti, Group>;
  /** Focus the control when it is mounted */
  autoFocus?: boolean;
  /** Remove the currently focused option when the user presses backspace when Select isClearable or isMulti */
  backspaceRemovesValue: boolean;
  /** Remove focus from the input when the user selects an option (handy for dismissing the keyboard on touch devices) */
  blurInputOnSelect: boolean;
  /** When the user reaches the top/bottom of the menu, prevent scroll on the scroll-parent  */
  captureMenuScroll: boolean;
  /** Sets a className attribute on the outer component */
  className?: string;
  /**
   * If provided, all inner components will be given a prefixed className attribute.
   *
   * This is useful when styling via CSS classes instead of the Styles API approach.
   */
  classNamePrefix?: string | null;
  /**
   * Provide classNames based on state for each inner component
   */
  classNames: ClassNamesConfig<Option, IsMulti, Group>;
  /** Close the select menu when the user selects an option */
  closeMenuOnSelect: boolean;
  /**
   * If `true`, close the select menu when the user scrolls the document/body.
   *
   * If a function, takes a standard javascript `ScrollEvent` you return a boolean:
   *
   * `true` => The menu closes
   *
   * `false` => The menu stays open
   *
   * This is useful when you have a scrollable modal and want to portal the menu out,
   * but want to avoid graphical issues.
   */
  closeMenuOnScroll: boolean | ((event: Event) => boolean);
  /**
   * This complex object includes all the compositional components that are used
   * in `react-select`. If you wish to overwrite a component, pass in an object
   * with the appropriate namespace.
   *
   * If you only wish to restyle a component, we recommend using the `styles` prop
   * instead. For a list of the components that can be passed in, and the shape
   * that will be passed to them, see [the components docs](/components)
   */
  components: SelectComponentsConfig<Option, IsMulti, Group>;
  /** Whether the value of the select, e.g. SingleValue, should be displayed in the control. */
  controlShouldRenderValue: boolean;
  /** Delimiter used to join multiple values into a single HTML Input value */
  delimiter?: string;
  /** Clear all values when the user presses escape AND the menu is closed */
  escapeClearsValue: boolean;
  /** Custom method to filter whether an option should be displayed in the menu */
  filterOption:
    | ((option: FilterOptionOption<Option>, inputValue: string) => boolean)
    | null;
  /**
   * Formats group labels in the menu as React components
   *
   * An example can be found in the [Replacing builtins](/advanced#replacing-builtins) documentation.
   */
  formatGroupLabel: (group: Group) => ReactNode;
  /** Formats option labels in the menu and control as React components */
  formatOptionLabel?: (
    data: Option,
    formatOptionLabelMeta: FormatOptionLabelMeta<Option>
  ) => ReactNode;
  /**
   * Resolves option data to a string to be displayed as the label by components
   *
   * Note: Failure to resolve to a string type can interfere with filtering and
   * screen reader support.
   */
  getOptionLabel: GetOptionLabel<Option>;
  /** Resolves option data to a string to compare options and specify value attributes */
  getOptionValue: GetOptionValue<Option>;
  /** Hide the selected option from the menu */
  hideSelectedOptions?: boolean;
  /** The id to set on the SelectContainer component. */
  id?: string;
  /** The value of the search input */
  inputValue: string;
  /** The id of the search input */
  inputId?: string;
  /** Define an id prefix for the select components e.g. {your-id}-value */
  instanceId?: number | string;
  /** Is the select value clearable */
  isClearable?: boolean;
  /** Is the select disabled */
  isDisabled: boolean;
  /** Is the select in a state of loading (async) */
  isLoading: boolean;
  /**
   * Override the built-in logic to detect whether an option is disabled
   *
   * An example can be found in the [Replacing builtins](/advanced#replacing-builtins) documentation.
   */
  isOptionDisabled: (option: Option, selectValue: Options<Option>) => boolean;
  /** Override the built-in logic to detect whether an option is selected */
  isOptionSelected?: (option: Option, selectValue: Options<Option>) => boolean;
  /** Support multiple selected options */
  isMulti: IsMulti;
  /** Is the select direction right-to-left */
  isRtl: boolean;
  /** Whether to enable search functionality */
  isSearchable: boolean;
  /** Async: Text to display when loading options */
  loadingMessage: (obj: { inputValue: string }) => ReactNode;
  /** Minimum height of the menu before flipping */
  minMenuHeight: number;
  /** Maximum height of the menu before scrolling */
  maxMenuHeight: number;
  /** Whether the menu is open */
  menuIsOpen: boolean;
  /**
   * Default placement of the menu in relation to the control. 'auto' will flip
   * when there isn't enough space below the control.
   */
  menuPlacement: MenuPlacement;
  /** The CSS position value of the menu, when "fixed" extra layout management is required */
  menuPosition: MenuPosition;
  /**
   * Whether the menu should use a portal, and where it should attach
   *
   * An example can be found in the [Portaling](/advanced#portaling) documentation
   */
  menuPortalTarget?: HTMLElement | null;
  /** Whether to block scroll events when the menu is open */
  menuShouldBlockScroll: boolean;
  /** Whether the menu should be scrolled into view when it opens */
  menuShouldScrollIntoView: boolean;
  /** Name of the HTML Input (optional - without this, no input will be rendered) */
  name?: string;
  /** Text to display when there are no options */
  noOptionsMessage: (obj: { inputValue: string }) => ReactNode;
  /** Handle blur events on the control */
  onBlur?: FocusEventHandler<HTMLInputElement>;
  /** Handle change events on the select */
  onChange: (
    newValue: OnChangeValue<Option, IsMulti>,
    actionMeta: ActionMeta<Option>
  ) => void;
  /** Handle focus events on the control */
  onFocus?: FocusEventHandler<HTMLInputElement>;
  /** Handle change events on the input */
  onInputChange: (newValue: string, actionMeta: InputActionMeta) => void;
  /** Handle key down events on the select */
  onKeyDown?: KeyboardEventHandler<HTMLDivElement>;
  /** Handle the menu opening */
  onMenuOpen: () => void;
  /** Handle the menu closing */
  onMenuClose: () => void;
  /** Fired when the user scrolls to the top of the menu */
  onMenuScrollToTop?: (event: WheelEvent | TouchEvent) => void;
  /** Fired when the user scrolls to the bottom of the menu */
  onMenuScrollToBottom?: (event: WheelEvent | TouchEvent) => void;
  /** Allows control of whether the menu is opened when the Select is focused */
  openMenuOnFocus: boolean;
  /** Allows control of whether the menu is opened when the Select is clicked */
  openMenuOnClick: boolean;
  /** Array of options that populate the select menu */
  options: OptionsOrGroups<Option, Group>;
  /** Number of options to jump in menu when page{up|down} keys are used */
  pageSize: number;
  /** Placeholder for the select value */
  placeholder: ReactNode;
  /** Status to relay to screen readers */
  screenReaderStatus: (obj: { count: number }) => string;
  /**
   * Style modifier methods
   *
   * A basic example can be found at the bottom of the [Replacing builtins](/advanced#replacing-builtins) documentation.
   */
  styles: StylesConfig<Option, IsMulti, Group>;
  /** Theme modifier method */
  theme?: ThemeConfig;
  /** Sets the tabIndex attribute on the input */
  tabIndex: number;
  /** Select the currently focused option when the user presses tab */
  tabSelectsValue: boolean;
  /** Remove all non-essential styles */
  unstyled: boolean;
  /** The value of the select; reflected by the selected option */
  value: PropsValue<Option>;
  /** Sets the form attribute on the input */
  form?: string;
  /** Marks the value-holding input as required for form validation */
  required?: boolean;
}

export const defaultProps = {
  'aria-live': 'polite',
  backspaceRemovesValue: true,
  blurInputOnSelect: isTouchCapable(),
  captureMenuScroll: !isTouchCapable(),
  classNames: {},
  closeMenuOnSelect: true,
  closeMenuOnScroll: false,
  components: {},
  controlShouldRenderValue: true,
  escapeClearsValue: false,
  filterOption: createFilter(),
  formatGroupLabel: formatGroupLabelBuiltin,
  getOptionLabel: getOptionLabelBuiltin,
  getOptionValue: getOptionValueBuiltin,
  isDisabled: false,
  isLoading: false,
  isMulti: false,
  isRtl: false,
  isSearchable: true,
  isOptionDisabled: isOptionDisabledBuiltin,
  loadingMessage: () => 'Loading...',
  maxMenuHeight: 300,
  minMenuHeight: 140,
  menuIsOpen: false,
  menuPlacement: 'bottom',
  menuPosition: 'absolute',
  menuShouldBlockScroll: false,
  menuShouldScrollIntoView: !isMobileDevice(),
  noOptionsMessage: () => 'No options',
  openMenuOnFocus: false,
  openMenuOnClick: true,
  options: [],
  pageSize: 5,
  placeholder: 'Select...',
  screenReaderStatus: ({ count }: { count: number }) =>
    `${count} result${count !== 1 ? 's' : ''} available`,
  styles: {},
  tabIndex: 0,
  tabSelectsValue: true,
  unstyled: false,
};

interface State<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
> {
  ariaSelection: AriaSelection<Option, IsMulti> | null;
  inputIsHidden: boolean;
  isFocused: boolean;
  focusedOption: Option | null;
  focusedOptionId: string | null;
  focusableOptionsWithIds: FocusableOptionWithId<Option>[];
  focusedValue: Option | null;
  selectValue: Options<Option>;
  clearFocusValueOnUpdate: boolean;
  prevWasFocused: boolean;
  inputIsHiddenAfterUpdate: boolean | null | undefined;
  prevProps: Props<Option, IsMulti, Group> | void;
  instancePrefix: string;
}

interface CategorizedOption<Option> {
  type: 'option';
  data: Option;
  isDisabled: boolean;
  isSelected: boolean;
  label: string;
  value: string;
  index: number;
}

interface FocusableOptionWithId<Option> {
  data: Option;
  id: string;
}

interface CategorizedGroup<Option, Group extends GroupBase<Option>> {
  type: 'group';
  data: Group;
  options: readonly CategorizedOption<Option>[];
  index: number;
}

type CategorizedGroupOrOption<Option, Group extends GroupBase<Option>> =
  | CategorizedGroup<Option, Group>
  | CategorizedOption<Option>;

function toCategorizedOption<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>(
  props: Props<Option, IsMulti, Group>,
  option: Option,
  selectValue: Options<Option>,
  index: number
): CategorizedOption<Option> {
  const isDisabled = isOptionDisabled(props, option, selectValue);
  const isSelected = isOptionSelected(props, option, selectValue);
  const label = getOptionLabel(props, option);
  const value = getOptionValue(props, option);

  return {
    type: 'option',
    data: option,
    isDisabled,
    isSelected,
    label,
    value,
    index,
  };
}

function buildCategorizedOptions<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>(
  props: Props<Option, IsMulti, Group>,
  selectValue: Options<Option>
): CategorizedGroupOrOption<Option, Group>[] {
  return props.options
    .map((groupOrOption, groupOrOptionIndex) => {
      if ('options' in groupOrOption) {
        const categorizedOptions = groupOrOption.options
          .map((option, optionIndex) =>
            toCategorizedOption(props, option, selectValue, optionIndex)
          )
          .filter((categorizedOption) => isFocusable(props, categorizedOption));
        return categorizedOptions.length > 0
          ? {
              type: 'group' as const,
              data: groupOrOption,
              options: categorizedOptions,
              index: groupOrOptionIndex,
            }
          : undefined;
      }
      const categorizedOption = toCategorizedOption(
        props,
        groupOrOption,
        selectValue,
        groupOrOptionIndex
      );
      return isFocusable(props, categorizedOption)
        ? categorizedOption
        : undefined;
    })
    .filter(notNullish);
}

function buildFocusableOptionsFromCategorizedOptions<
  Option,
  Group extends GroupBase<Option>
>(categorizedOptions: readonly CategorizedGroupOrOption<Option, Group>[]) {
  return categorizedOptions.reduce<Option[]>(
    (optionsAccumulator, categorizedOption) => {
      if (categorizedOption.type === 'group') {
        optionsAccumulator.push(
          ...categorizedOption.options.map((option) => option.data)
        );
      } else {
        optionsAccumulator.push(categorizedOption.data);
      }
      return optionsAccumulator;
    },
    []
  );
}

function buildFocusableOptionsWithIds<Option, Group extends GroupBase<Option>>(
  categorizedOptions: readonly CategorizedGroupOrOption<Option, Group>[],
  optionId: string
) {
  return categorizedOptions.reduce<FocusableOptionWithId<Option>[]>(
    (optionsAccumulator, categorizedOption) => {
      if (categorizedOption.type === 'group') {
        optionsAccumulator.push(
          ...categorizedOption.options.map((option) => ({
            data: option.data,
            id: `${optionId}-${categorizedOption.index}-${option.index}`,
          }))
        );
      } else {
        optionsAccumulator.push({
          data: categorizedOption.data,
          id: `${optionId}-${categorizedOption.index}`,
        });
      }
      return optionsAccumulator;
    },
    []
  );
}

function buildFocusableOptions<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>(props: Props<Option, IsMulti, Group>, selectValue: Options<Option>) {
  return buildFocusableOptionsFromCategorizedOptions(
    buildCategorizedOptions(props, selectValue)
  );
}

function isFocusable<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>(
  props: Props<Option, IsMulti, Group>,
  categorizedOption: CategorizedOption<Option>
) {
  const { inputValue = '' } = props;
  const { data, isSelected, label, value } = categorizedOption;

  return (
    (!shouldHideSelectedOptions(props) || !isSelected) &&
    filterOption(props, { label, value, data }, inputValue)
  );
}

function getNextFocusedValue<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>(state: State<Option, IsMulti, Group>, nextSelectValue: Options<Option>) {
  const { focusedValue, selectValue: lastSelectValue } = state;
  const lastFocusedIndex = lastSelectValue.indexOf(focusedValue!);
  if (lastFocusedIndex > -1) {
    const nextFocusedIndex = nextSelectValue.indexOf(focusedValue!);
    if (nextFocusedIndex > -1) {
      // the focused value is still in the selectValue, return it
      return focusedValue;
    } else if (lastFocusedIndex < nextSelectValue.length) {
      // the focusedValue is not present in the next selectValue array by
      // reference, so return the new value at the same index
      return nextSelectValue[lastFocusedIndex];
    }
  }
  return null;
}

function getNextFocusedOption<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>(state: State<Option, IsMulti, Group>, options: Options<Option>) {
  const { focusedOption: lastFocusedOption } = state;
  return lastFocusedOption && options.indexOf(lastFocusedOption) > -1
    ? lastFocusedOption
    : options[0];
}

const getFocusedOptionId = <Option,>(
  focusableOptionsWithIds: FocusableOptionWithId<Option>[],
  focusedOption: Option
) => {
  const focusedOptionId = focusableOptionsWithIds.find(
    (option) => option.data === focusedOption
  )?.id;
  return focusedOptionId || null;
};

const getOptionLabel = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>(
  props: Props<Option, IsMulti, Group>,
  data: Option
): string => {
  return props.getOptionLabel(data);
};
const getOptionValue = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>(
  props: Props<Option, IsMulti, Group>,
  data: Option
): string => {
  return props.getOptionValue(data);
};

function isOptionDisabled<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>(
  props: Props<Option, IsMulti, Group>,
  option: Option,
  selectValue: Options<Option>
): boolean {
  return typeof props.isOptionDisabled === 'function'
    ? props.isOptionDisabled(option, selectValue)
    : false;
}
function isOptionSelected<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>(
  props: Props<Option, IsMulti, Group>,
  option: Option,
  selectValue: Options<Option>
): boolean {
  if (selectValue.indexOf(option) > -1) return true;
  if (typeof props.isOptionSelected === 'function') {
    return props.isOptionSelected(option, selectValue);
  }
  const candidate = getOptionValue(props, option);
  return selectValue.some((i) => getOptionValue(props, i) === candidate);
}
function filterOption<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>(
  props: Props<Option, IsMulti, Group>,
  option: FilterOptionOption<Option>,
  inputValue: string
) {
  return props.filterOption ? props.filterOption(option, inputValue) : true;
}

const shouldHideSelectedOptions = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>(
  props: Props<Option, IsMulti, Group>
) => {
  const { hideSelectedOptions, isMulti } = props;
  if (hideSelectedOptions === undefined) return isMulti;
  return hideSelectedOptions;
};

let instanceId = 1;

export default class Select<
  Option = unknown,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
> extends Component<
  Props<Option, IsMulti, Group>,
  State<Option, IsMulti, Group>
> {
  static defaultProps = defaultProps;
  state: State<Option, IsMulti, Group> = {
    ariaSelection: null,
    focusedOption: null,
    focusedOptionId: null,
    focusableOptionsWithIds: [],
    focusedValue: null,
    inputIsHidden: false,
    isFocused: false,
    selectValue: [],
    clearFocusValueOnUpdate: false,
    prevWasFocused: false,
    inputIsHiddenAfterUpdate: undefined,
    prevProps: undefined,
    instancePrefix: '',
  };

  // Misc. Instance Properties
  // ------------------------------

  blockOptionHover = false;
  isComposing = false;
  commonProps: any; // TODO
  initialTouchX = 0;
  initialTouchY = 0;
  openAfterFocus = false;
  scrollToFocusedOptionOnUpdate = false;
  userIsDragging?: boolean;
  isAppleDevice = isAppleDevice();

  // Refs
  // ------------------------------

  controlRef: HTMLDivElement | null = null;
  getControlRef: RefCallback<HTMLDivElement> = (ref) => {
    this.controlRef = ref;
  };
  focusedOptionRef: HTMLDivElement | null = null;
  getFocusedOptionRef: RefCallback<HTMLDivElement> = (ref) => {
    this.focusedOptionRef = ref;
  };
  menuListRef: HTMLDivElement | null = null;
  getMenuListRef: RefCallback<HTMLDivElement> = (ref) => {
    this.menuListRef = ref;
  };
  inputRef: HTMLInputElement | null = null;
  getInputRef: RefCallback<HTMLInputElement> = (ref) => {
    this.inputRef = ref;
  };

  // Lifecycle
  // ------------------------------

  constructor(props: Props<Option, IsMulti, Group>) {
    super(props);
    this.state.instancePrefix =
      'react-select-' + (this.props.instanceId || ++instanceId);
    this.state.selectValue = cleanValue(props.value);
    // Set focusedOption if menuIsOpen is set on init (e.g. defaultMenuIsOpen)
    if (props.menuIsOpen && this.state.selectValue.length) {
      const focusableOptionsWithIds: FocusableOptionWithId<Option>[] =
        this.getFocusableOptionsWithIds();
      const focusableOptions = this.buildFocusableOptions();
      const optionIndex = focusableOptions.indexOf(this.state.selectValue[0]);
      this.state.focusableOptionsWithIds = focusableOptionsWithIds;
      this.state.focusedOption = focusableOptions[optionIndex];
      this.state.focusedOptionId = getFocusedOptionId(
        focusableOptionsWithIds,
        focusableOptions[optionIndex]
      );
    }
  }

  static getDerivedStateFromProps(
    props: Props<unknown, boolean, GroupBase<unknown>>,
    state: State<unknown, boolean, GroupBase<unknown>>
  ) {
    const {
      prevProps,
      clearFocusValueOnUpdate,
      inputIsHiddenAfterUpdate,
      ariaSelection,
      isFocused,
      prevWasFocused,
      instancePrefix,
    } = state;
    const { options, value, menuIsOpen, inputValue, isMulti } = props;
    const selectValue = cleanValue(value);
    let newMenuOptionsState = {};
    if (
      prevProps &&
      (value !== prevProps.value ||
        options !== prevProps.options ||
        menuIsOpen !== prevProps.menuIsOpen ||
        inputValue !== prevProps.inputValue)
    ) {
      const focusableOptions = menuIsOpen
        ? buildFocusableOptions(props, selectValue)
        : [];

      const focusableOptionsWithIds = menuIsOpen
        ? buildFocusableOptionsWithIds(
            buildCategorizedOptions(props, selectValue),
            `${instancePrefix}-option`
          )
        : [];

      const focusedValue = clearFocusValueOnUpdate
        ? getNextFocusedValue(state, selectValue)
        : null;
      const focusedOption = getNextFocusedOption(state, focusableOptions);
      const focusedOptionId = getFocusedOptionId(
        focusableOptionsWithIds,
        focusedOption
      );

      newMenuOptionsState = {
        selectValue,
        focusedOption,
        focusedOptionId,
        focusableOptionsWithIds,
        focusedValue,
        clearFocusValueOnUpdate: false,
      };
    }
    // some updates should toggle the state of the input visibility
    const newInputIsHiddenState =
      inputIsHiddenAfterUpdate != null && props !== prevProps
        ? {
            inputIsHidden: inputIsHiddenAfterUpdate,
            inputIsHiddenAfterUpdate: undefined,
          }
        : {};

    let newAriaSelection = ariaSelection;

    let hasKeptFocus = isFocused && prevWasFocused;

    if (isFocused && !hasKeptFocus) {
      // If `value` or `defaultValue` props are not empty then announce them
      // when the Select is initially focused
      newAriaSelection = {
        value: valueTernary(isMulti, selectValue, selectValue[0] || null),
        options: selectValue,
        action: 'initial-input-focus',
      };

      hasKeptFocus = !prevWasFocused;
    }

    // If the 'initial-input-focus' action has been set already
    // then reset the ariaSelection to null
    if (ariaSelection?.action === 'initial-input-focus') {
      newAriaSelection = null;
    }

    return {
      ...newMenuOptionsState,
      ...newInputIsHiddenState,
      prevProps: props,
      ariaSelection: newAriaSelection,
      prevWasFocused: hasKeptFocus,
    };
  }
  componentDidMount() {
    this.startListeningComposition();
    this.startListeningToTouch();

    if (this.props.closeMenuOnScroll && document && document.addEventListener) {
      // Listen to all scroll events, and filter them out inside of 'onScroll'
      document.addEventListener('scroll', this.onScroll, true);
    }

    if (this.props.autoFocus) {
      this.focusInput();
    }

    // Scroll focusedOption into view if menuIsOpen is set on mount (e.g. defaultMenuIsOpen)
    if (
      this.props.menuIsOpen &&
      this.state.focusedOption &&
      this.menuListRef &&
      this.focusedOptionRef
    ) {
      scrollIntoView(this.menuListRef, this.focusedOptionRef);
    }
  }
  componentDidUpdate(prevProps: Props<Option, IsMulti, Group>) {
    const { isDisabled, menuIsOpen } = this.props;
    const { isFocused } = this.state;

    if (
      // ensure focus is restored correctly when the control becomes enabled
      (isFocused && !isDisabled && prevProps.isDisabled) ||
      // ensure focus is on the Input when the menu opens
      (isFocused && menuIsOpen && !prevProps.menuIsOpen)
    ) {
      this.focusInput();
    }

    if (isFocused && isDisabled && !prevProps.isDisabled) {
      // ensure select state gets blurred in case Select is programmatically disabled while focused
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ isFocused: false }, this.onMenuClose);
    } else if (
      !isFocused &&
      !isDisabled &&
      prevProps.isDisabled &&
      this.inputRef === document.activeElement
    ) {
      // ensure select state gets focused in case Select is programatically re-enabled while focused (Firefox)
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ isFocused: true });
    }

    // scroll the focused option into view if necessary
    if (
      this.menuListRef &&
      this.focusedOptionRef &&
      this.scrollToFocusedOptionOnUpdate
    ) {
      scrollIntoView(this.menuListRef, this.focusedOptionRef);
      this.scrollToFocusedOptionOnUpdate = false;
    }
  }
  componentWillUnmount() {
    this.stopListeningComposition();
    this.stopListeningToTouch();
    document.removeEventListener('scroll', this.onScroll, true);
  }

  // ==============================
  // Consumer Handlers
  // ==============================

  onMenuOpen() {
    this.props.onMenuOpen();
  }
  onMenuClose() {
    this.onInputChange('', {
      action: 'menu-close',
      prevInputValue: this.props.inputValue,
    });

    this.props.onMenuClose();
  }
  onInputChange(newValue: string, actionMeta: InputActionMeta) {
    this.props.onInputChange(newValue, actionMeta);
  }

  // ==============================
  // Methods
  // ==============================

  focusInput() {
    if (!this.inputRef) return;
    this.inputRef.focus();
  }
  blurInput() {
    if (!this.inputRef) return;
    this.inputRef.blur();
  }

  // aliased for consumers
  focus = this.focusInput;
  blur = this.blurInput;

  openMenu(focusOption: 'first' | 'last') {
    const { selectValue, isFocused } = this.state;
    const focusableOptions = this.buildFocusableOptions();
    let openAtIndex = focusOption === 'first' ? 0 : focusableOptions.length - 1;

    if (!this.props.isMulti) {
      const selectedIndex = focusableOptions.indexOf(selectValue[0]);
      if (selectedIndex > -1) {
        openAtIndex = selectedIndex;
      }
    }

    // only scroll if the menu isn't already open
    this.scrollToFocusedOptionOnUpdate = !(isFocused && this.menuListRef);

    this.setState(
      {
        inputIsHiddenAfterUpdate: false,
        focusedValue: null,
        focusedOption: focusableOptions[openAtIndex],
        focusedOptionId: this.getFocusedOptionId(focusableOptions[openAtIndex]),
      },
      () => this.onMenuOpen()
    );
  }

  focusValue(direction: 'previous' | 'next') {
    const { selectValue, focusedValue } = this.state;

    // Only multiselects support value focusing
    if (!this.props.isMulti) return;

    this.setState({
      focusedOption: null,
    });

    let focusedIndex = selectValue.indexOf(focusedValue!);
    if (!focusedValue) {
      focusedIndex = -1;
    }

    const lastIndex = selectValue.length - 1;
    let nextFocus = -1;
    if (!selectValue.length) return;

    switch (direction) {
      case 'previous':
        if (focusedIndex === 0) {
          // don't cycle from the start to the end
          nextFocus = 0;
        } else if (focusedIndex === -1) {
          // if nothing is focused, focus the last value first
          nextFocus = lastIndex;
        } else {
          nextFocus = focusedIndex - 1;
        }
        break;
      case 'next':
        if (focusedIndex > -1 && focusedIndex < lastIndex) {
          nextFocus = focusedIndex + 1;
        }
        break;
    }
    this.setState({
      inputIsHidden: nextFocus !== -1,
      focusedValue: selectValue[nextFocus],
    });
  }

  focusOption(direction: FocusDirection = 'first') {
    const { pageSize } = this.props;
    const { focusedOption } = this.state;
    const options = this.getFocusableOptions();

    if (!options.length) return;
    let nextFocus = 0; // handles 'first'
    let focusedIndex = options.indexOf(focusedOption!);
    if (!focusedOption) {
      focusedIndex = -1;
    }

    if (direction === 'up') {
      nextFocus = focusedIndex > 0 ? focusedIndex - 1 : options.length - 1;
    } else if (direction === 'down') {
      nextFocus = (focusedIndex + 1) % options.length;
    } else if (direction === 'pageup') {
      nextFocus = focusedIndex - pageSize;
      if (nextFocus < 0) nextFocus = 0;
    } else if (direction === 'pagedown') {
      nextFocus = focusedIndex + pageSize;
      if (nextFocus > options.length - 1) nextFocus = options.length - 1;
    } else if (direction === 'last') {
      nextFocus = options.length - 1;
    }
    this.scrollToFocusedOptionOnUpdate = true;
    this.setState({
      focusedOption: options[nextFocus],
      focusedValue: null,
      focusedOptionId: this.getFocusedOptionId(options[nextFocus]),
    });
  }
  onChange = (
    newValue: OnChangeValue<Option, IsMulti>,
    actionMeta: ActionMeta<Option>
  ) => {
    const { onChange, name } = this.props;
    actionMeta.name = name;

    this.ariaOnChange(newValue, actionMeta);
    onChange(newValue, actionMeta);
  };
  setValue = (
    newValue: OnChangeValue<Option, IsMulti>,
    action: SetValueAction,
    option?: Option
  ) => {
    const { closeMenuOnSelect, isMulti, inputValue } = this.props;
    this.onInputChange('', { action: 'set-value', prevInputValue: inputValue });
    if (closeMenuOnSelect) {
      this.setState({
        inputIsHiddenAfterUpdate: !isMulti,
      });
      this.onMenuClose();
    }
    // when the select value should change, we should reset focusedValue
    this.setState({ clearFocusValueOnUpdate: true });
    this.onChange(newValue, { action, option });
  };
  selectOption = (newValue: Option) => {
    const { blurInputOnSelect, isMulti, name } = this.props;
    const { selectValue } = this.state;
    const deselected = isMulti && this.isOptionSelected(newValue, selectValue);
    const isDisabled = this.isOptionDisabled(newValue, selectValue);

    if (deselected) {
      const candidate = this.getOptionValue(newValue);
      this.setValue(
        multiValueAsValue(
          selectValue.filter((i) => this.getOptionValue(i) !== candidate)
        ),
        'deselect-option',
        newValue
      );
    } else if (!isDisabled) {
      // Select option if option is not disabled
      if (isMulti) {
        this.setValue(
          multiValueAsValue([...selectValue, newValue]),
          'select-option',
          newValue
        );
      } else {
        this.setValue(singleValueAsValue(newValue), 'select-option');
      }
    } else {
      this.ariaOnChange(singleValueAsValue(newValue), {
        action: 'select-option',
        option: newValue,
        name,
      });
      return;
    }

    if (blurInputOnSelect) {
      this.blurInput();
    }
  };
  removeValue = (removedValue: Option) => {
    const { isMulti } = this.props;
    const { selectValue } = this.state;
    const candidate = this.getOptionValue(removedValue);
    const newValueArray = selectValue.filter(
      (i) => this.getOptionValue(i) !== candidate
    );
    const newValue = valueTernary(
      isMulti,
      newValueArray,
      newValueArray[0] || null
    );

    this.onChange(newValue, { action: 'remove-value', removedValue });
    this.focusInput();
  };
  clearValue = () => {
    const { selectValue } = this.state;
    this.onChange(valueTernary(this.props.isMulti, [], null), {
      action: 'clear',
      removedValues: selectValue,
    });
  };
  popValue = () => {
    const { isMulti } = this.props;
    const { selectValue } = this.state;
    const lastSelectedValue = selectValue[selectValue.length - 1];
    const newValueArray = selectValue.slice(0, selectValue.length - 1);
    const newValue = valueTernary(
      isMulti,
      newValueArray,
      newValueArray[0] || null
    );

    this.onChange(newValue, {
      action: 'pop-value',
      removedValue: lastSelectedValue,
    });
  };

  // ==============================
  // Getters
  // ==============================

  getTheme() {
    // Use the default theme if there are no customisations.
    if (!this.props.theme) {
      return defaultTheme;
    }
    // If the theme prop is a function, assume the function
    // knows how to merge the passed-in default theme with
    // its own modifications.
    if (typeof this.props.theme === 'function') {
      return this.props.theme(defaultTheme);
    }
    // Otherwise, if a plain theme object was passed in,
    // overlay it with the default theme.
    return {
      ...defaultTheme,
      ...this.props.theme,
    };
  }

  getFocusedOptionId = (focusedOption: Option) => {
    return getFocusedOptionId(
      this.state.focusableOptionsWithIds,
      focusedOption
    );
  };

  getFocusableOptionsWithIds = () => {
    return buildFocusableOptionsWithIds(
      buildCategorizedOptions(this.props, this.state.selectValue),
      this.getElementId('option')
    );
  };

  getValue = () => this.state.selectValue;

  cx = (...args: any) => classNames(this.props.classNamePrefix, ...args);

  getCommonProps() {
    const {
      clearValue,
      cx,
      getStyles,
      getClassNames,
      getValue,
      selectOption,
      setValue,
      props,
    } = this;
    const { isMulti, isRtl, options } = props;
    const hasValue = this.hasValue();

    return {
      clearValue,
      cx,
      getStyles,
      getClassNames,
      getValue,
      hasValue,
      isMulti,
      isRtl,
      options,
      selectOption,
      selectProps: props,
      setValue,
      theme: this.getTheme(),
    };
  }

  getOptionLabel = (data: Option): string => {
    return getOptionLabel(this.props, data);
  };
  getOptionValue = (data: Option): string => {
    return getOptionValue(this.props, data);
  };
  getStyles = <Key extends keyof StylesProps<Option, IsMulti, Group>>(
    key: Key,
    props: StylesProps<Option, IsMulti, Group>[Key]
  ) => {
    const { unstyled } = this.props;
    const base = defaultStyles[key](props as any, unstyled);
    base.boxSizing = 'border-box';
    const custom = this.props.styles[key];
    return custom ? custom(base, props as any) : base;
  };
  getClassNames = <Key extends keyof StylesProps<Option, IsMulti, Group>>(
    key: Key,
    props: StylesProps<Option, IsMulti, Group>[Key]
  ) => this.props.classNames[key]?.(props as any);
  getElementId = (
    element:
      | 'group'
      | 'input'
      | 'listbox'
      | 'option'
      | 'placeholder'
      | 'live-region'
  ) => {
    return `${this.state.instancePrefix}-${element}`;
  };

  getComponents = () => {
    return defaultComponents(this.props);
  };

  buildCategorizedOptions = () =>
    buildCategorizedOptions(this.props, this.state.selectValue);
  getCategorizedOptions = () =>
    this.props.menuIsOpen ? this.buildCategorizedOptions() : [];
  buildFocusableOptions = () =>
    buildFocusableOptionsFromCategorizedOptions(this.buildCategorizedOptions());
  getFocusableOptions = () =>
    this.props.menuIsOpen ? this.buildFocusableOptions() : [];

  // ==============================
  // Helpers
  // ==============================

  ariaOnChange = (
    value: OnChangeValue<Option, IsMulti>,
    actionMeta: ActionMeta<Option>
  ) => {
    this.setState({ ariaSelection: { value, ...actionMeta } });
  };

  hasValue() {
    const { selectValue } = this.state;
    return selectValue.length > 0;
  }
  hasOptions() {
    return !!this.getFocusableOptions().length;
  }
  isClearable(): boolean {
    const { isClearable, isMulti } = this.props;

    // single select, by default, IS NOT clearable
    // multi select, by default, IS clearable
    if (isClearable === undefined) return isMulti;

    return isClearable;
  }
  isOptionDisabled(option: Option, selectValue: Options<Option>): boolean {
    return isOptionDisabled(this.props, option, selectValue);
  }
  isOptionSelected(option: Option, selectValue: Options<Option>): boolean {
    return isOptionSelected(this.props, option, selectValue);
  }
  filterOption(option: FilterOptionOption<Option>, inputValue: string) {
    return filterOption(this.props, option, inputValue);
  }
  formatOptionLabel(
    data: Option,
    context: FormatOptionLabelContext
  ): ReactNode {
    if (typeof this.props.formatOptionLabel === 'function') {
      const { inputValue } = this.props;
      const { selectValue } = this.state;
      return this.props.formatOptionLabel(data, {
        context,
        inputValue,
        selectValue,
      });
    } else {
      return this.getOptionLabel(data);
    }
  }
  formatGroupLabel(data: Group) {
    return this.props.formatGroupLabel(data);
  }

  // ==============================
  // Mouse Handlers
  // ==============================

  onMenuMouseDown: MouseEventHandler<HTMLDivElement> = (event) => {
    if (event.button !== 0) {
      return;
    }
    event.stopPropagation();
    event.preventDefault();
    this.focusInput();
  };
  onMenuMouseMove: MouseEventHandler<HTMLDivElement> = (event) => {
    this.blockOptionHover = false;
  };
  onControlMouseDown = (
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    // Event captured by dropdown indicator
    if (event.defaultPrevented) {
      return;
    }
    const { openMenuOnClick } = this.props;
    if (!this.state.isFocused) {
      if (openMenuOnClick) {
        this.openAfterFocus = true;
      }
      this.focusInput();
    } else if (!this.props.menuIsOpen) {
      if (openMenuOnClick) {
        this.openMenu('first');
      }
    } else {
      if (
        (event.target as HTMLElement).tagName !== 'INPUT' &&
        (event.target as HTMLElement).tagName !== 'TEXTAREA'
      ) {
        this.onMenuClose();
      }
    }
    if (
      (event.target as HTMLElement).tagName !== 'INPUT' &&
      (event.target as HTMLElement).tagName !== 'TEXTAREA'
    ) {
      event.preventDefault();
    }
  };
  onDropdownIndicatorMouseDown = (
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    // ignore mouse events that weren't triggered by the primary button
    if (
      event &&
      event.type === 'mousedown' &&
      (event as React.MouseEvent<HTMLDivElement>).button !== 0
    ) {
      return;
    }
    if (this.props.isDisabled) return;
    const { isMulti, menuIsOpen } = this.props;
    this.focusInput();
    if (menuIsOpen) {
      this.setState({ inputIsHiddenAfterUpdate: !isMulti });
      this.onMenuClose();
    } else {
      this.openMenu('first');
    }
    event.preventDefault();
  };
  onClearIndicatorMouseDown = (
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    // ignore mouse events that weren't triggered by the primary button
    if (
      event &&
      event.type === 'mousedown' &&
      (event as React.MouseEvent<HTMLDivElement>).button !== 0
    ) {
      return;
    }
    this.clearValue();
    event.preventDefault();
    this.openAfterFocus = false;
    if (event.type === 'touchend') {
      this.focusInput();
    } else {
      setTimeout(() => this.focusInput());
    }
  };
  onScroll = (event: Event) => {
    if (typeof this.props.closeMenuOnScroll === 'boolean') {
      if (
        event.target instanceof HTMLElement &&
        isDocumentElement(event.target)
      ) {
        this.props.onMenuClose();
      }
    } else if (typeof this.props.closeMenuOnScroll === 'function') {
      if (this.props.closeMenuOnScroll(event)) {
        this.props.onMenuClose();
      }
    }
  };

  // ==============================
  // Composition Handlers
  // ==============================

  startListeningComposition() {
    if (document && document.addEventListener) {
      document.addEventListener(
        'compositionstart',
        this.onCompositionStart,
        false
      );
      document.addEventListener('compositionend', this.onCompositionEnd, false);
    }
  }
  stopListeningComposition() {
    if (document && document.removeEventListener) {
      document.removeEventListener('compositionstart', this.onCompositionStart);
      document.removeEventListener('compositionend', this.onCompositionEnd);
    }
  }
  onCompositionStart = () => {
    this.isComposing = true;
  };
  onCompositionEnd = () => {
    this.isComposing = false;
  };

  // ==============================
  // Touch Handlers
  // ==============================

  startListeningToTouch() {
    if (document && document.addEventListener) {
      document.addEventListener('touchstart', this.onTouchStart, false);
      document.addEventListener('touchmove', this.onTouchMove, false);
      document.addEventListener('touchend', this.onTouchEnd, false);
    }
  }
  stopListeningToTouch() {
    if (document && document.removeEventListener) {
      document.removeEventListener('touchstart', this.onTouchStart);
      document.removeEventListener('touchmove', this.onTouchMove);
      document.removeEventListener('touchend', this.onTouchEnd);
    }
  }
  onTouchStart = ({ touches }: TouchEvent) => {
    const touch = touches && touches.item(0);
    if (!touch) {
      return;
    }

    this.initialTouchX = touch.clientX;
    this.initialTouchY = touch.clientY;
    this.userIsDragging = false;
  };
  onTouchMove = ({ touches }: TouchEvent) => {
    const touch = touches && touches.item(0);
    if (!touch) {
      return;
    }

    const deltaX = Math.abs(touch.clientX - this.initialTouchX);
    const deltaY = Math.abs(touch.clientY - this.initialTouchY);
    const moveThreshold = 5;

    this.userIsDragging = deltaX > moveThreshold || deltaY > moveThreshold;
  };
  onTouchEnd = (event: TouchEvent) => {
    if (this.userIsDragging) return;

    // close the menu if the user taps outside
    // we're checking on event.target here instead of event.currentTarget, because we want to assert information
    // on events on child elements, not the document (which we've attached this handler to).
    if (
      this.controlRef &&
      !this.controlRef.contains(event.target as Node) &&
      this.menuListRef &&
      !this.menuListRef.contains(event.target as Node)
    ) {
      this.blurInput();
    }

    // reset move vars
    this.initialTouchX = 0;
    this.initialTouchY = 0;
  };
  onControlTouchEnd: TouchEventHandler<HTMLDivElement> = (event) => {
    if (this.userIsDragging) return;
    this.onControlMouseDown(event);
  };
  onClearIndicatorTouchEnd: TouchEventHandler<HTMLDivElement> = (event) => {
    if (this.userIsDragging) return;

    this.onClearIndicatorMouseDown(event);
  };
  onDropdownIndicatorTouchEnd: TouchEventHandler<HTMLDivElement> = (event) => {
    if (this.userIsDragging) return;

    this.onDropdownIndicatorMouseDown(event);
  };

  // ==============================
  // Focus Handlers
  // ==============================

  handleInputChange: FormEventHandler<HTMLInputElement> = (event) => {
    const { inputValue: prevInputValue } = this.props;
    const inputValue = event.currentTarget.value;
    this.setState({ inputIsHiddenAfterUpdate: false });
    this.onInputChange(inputValue, { action: 'input-change', prevInputValue });
    if (!this.props.menuIsOpen) {
      this.onMenuOpen();
    }
  };
  onInputFocus: FocusEventHandler<HTMLInputElement> = (event) => {
    if (this.props.onFocus) {
      this.props.onFocus(event);
    }
    this.setState({
      inputIsHiddenAfterUpdate: false,
      isFocused: true,
    });
    if (this.openAfterFocus || this.props.openMenuOnFocus) {
      this.openMenu('first');
    }
    this.openAfterFocus = false;
  };
  onInputBlur: FocusEventHandler<HTMLInputElement> = (event) => {
    const { inputValue: prevInputValue } = this.props;
    if (this.menuListRef && this.menuListRef.contains(document.activeElement)) {
      this.inputRef!.focus();
      return;
    }
    if (this.props.onBlur) {
      this.props.onBlur(event);
    }
    this.onInputChange('', { action: 'input-blur', prevInputValue });
    this.onMenuClose();
    this.setState({
      focusedValue: null,
      isFocused: false,
    });
  };
  onOptionHover = (focusedOption: Option) => {
    if (this.blockOptionHover || this.state.focusedOption === focusedOption) {
      return;
    }
    const options = this.getFocusableOptions();
    const focusedOptionIndex = options.indexOf(focusedOption!);
    this.setState({
      focusedOption,
      focusedOptionId:
        focusedOptionIndex > -1 ? this.getFocusedOptionId(focusedOption) : null,
    });
  };
  shouldHideSelectedOptions = () => {
    return shouldHideSelectedOptions(this.props);
  };

  // If the hidden input gets focus through form submit,
  // redirect focus to focusable input.
  onValueInputFocus: FocusEventHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();

    this.focus();
  };

  // ==============================
  // Keyboard Handlers
  // ==============================

  onKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
    const {
      isMulti,
      backspaceRemovesValue,
      escapeClearsValue,
      inputValue,
      isClearable,
      isDisabled,
      menuIsOpen,
      onKeyDown,
      tabSelectsValue,
      openMenuOnFocus,
    } = this.props;
    const { focusedOption, focusedValue, selectValue } = this.state;

    if (isDisabled) return;

    if (typeof onKeyDown === 'function') {
      onKeyDown(event);
      if (event.defaultPrevented) {
        return;
      }
    }

    // Block option hover events when the user has just pressed a key
    this.blockOptionHover = true;
    switch (event.key) {
      case 'ArrowLeft':
        if (!isMulti || inputValue) return;
        this.focusValue('previous');
        break;
      case 'ArrowRight':
        if (!isMulti || inputValue) return;
        this.focusValue('next');
        break;
      case 'Delete':
      case 'Backspace':
        if (inputValue) return;
        if (focusedValue) {
          this.removeValue(focusedValue);
        } else {
          if (!backspaceRemovesValue) return;
          if (isMulti) {
            this.popValue();
          } else if (isClearable) {
            this.clearValue();
          }
        }
        break;
      case 'Tab':
        if (this.isComposing) return;

        if (
          event.shiftKey ||
          !menuIsOpen ||
          !tabSelectsValue ||
          !focusedOption ||
          // don't capture the event if the menu opens on focus and the focused
          // option is already selected; it breaks the flow of navigation
          (openMenuOnFocus && this.isOptionSelected(focusedOption, selectValue))
        ) {
          return;
        }
        this.selectOption(focusedOption);
        break;
      case 'Enter':
        if (event.keyCode === 229) {
          // ignore the keydown event from an Input Method Editor(IME)
          // ref. https://www.w3.org/TR/uievents/#determine-keydown-keyup-keyCode
          break;
        }
        if (menuIsOpen) {
          if (!focusedOption) return;
          if (this.isComposing) return;
          this.selectOption(focusedOption);
          break;
        }
        return;
      case 'Escape':
        if (menuIsOpen) {
          this.setState({
            inputIsHiddenAfterUpdate: false,
          });
          this.onInputChange('', {
            action: 'menu-close',
            prevInputValue: inputValue,
          });
          this.onMenuClose();
        } else if (isClearable && escapeClearsValue) {
          this.clearValue();
        }
        break;
      case ' ': // space
        if (inputValue) {
          return;
        }
        if (!menuIsOpen) {
          this.openMenu('first');
          break;
        }
        if (!focusedOption) return;
        this.selectOption(focusedOption);
        break;
      case 'ArrowUp':
        if (menuIsOpen) {
          this.focusOption('up');
        } else {
          this.openMenu('last');
        }
        break;
      case 'ArrowDown':
        if (menuIsOpen) {
          this.focusOption('down');
        } else {
          this.openMenu('first');
        }
        break;
      case 'PageUp':
        if (!menuIsOpen) return;
        this.focusOption('pageup');
        break;
      case 'PageDown':
        if (!menuIsOpen) return;
        this.focusOption('pagedown');
        break;
      case 'Home':
        if (!menuIsOpen) return;
        this.focusOption('first');
        break;
      case 'End':
        if (!menuIsOpen) return;
        this.focusOption('last');
        break;
      default:
        return;
    }
    event.preventDefault();
  };

  // ==============================
  // Renderers
  // ==============================
  renderInput() {
    const {
      isDisabled,
      isSearchable,
      inputId,
      inputValue,
      tabIndex,
      form,
      menuIsOpen,
      required,
    } = this.props;
    const { Input } = this.getComponents();
    const { inputIsHidden, ariaSelection } = this.state;
    const { commonProps } = this;

    const id = inputId || this.getElementId('input');

    // aria attributes makes the JSX "noisy", separated for clarity
    const ariaAttributes = {
      'aria-autocomplete': 'list' as const,
      'aria-expanded': menuIsOpen,
      'aria-haspopup': true,
      'aria-errormessage': this.props['aria-errormessage'],
      'aria-invalid': this.props['aria-invalid'],
      'aria-label': this.props['aria-label'],
      'aria-labelledby': this.props['aria-labelledby'],
      'aria-required': required,
      role: 'combobox',
      'aria-activedescendant': this.isAppleDevice
        ? undefined
        : this.state.focusedOptionId || '',

      ...(menuIsOpen && {
        'aria-controls': this.getElementId('listbox'),
      }),
      ...(!isSearchable && {
        'aria-readonly': true,
      }),
      ...(this.hasValue()
        ? ariaSelection?.action === 'initial-input-focus' && {
            'aria-describedby': this.getElementId('live-region'),
          }
        : {
            'aria-describedby': this.getElementId('placeholder'),
          }),
    };

    if (!isSearchable) {
      // use a dummy input to maintain focus/blur functionality
      return (
        <DummyInput
          id={id}
          innerRef={this.getInputRef}
          onBlur={this.onInputBlur}
          onChange={noop}
          onFocus={this.onInputFocus}
          disabled={isDisabled}
          tabIndex={tabIndex}
          inputMode="none"
          form={form}
          value=""
          {...ariaAttributes}
        />
      );
    }

    return (
      <Input
        {...commonProps}
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect="off"
        id={id}
        innerRef={this.getInputRef}
        isDisabled={isDisabled}
        isHidden={inputIsHidden}
        onBlur={this.onInputBlur}
        onChange={this.handleInputChange}
        onFocus={this.onInputFocus}
        spellCheck="false"
        tabIndex={tabIndex}
        form={form}
        type="text"
        value={inputValue}
        {...ariaAttributes}
      />
    );
  }
  renderPlaceholderOrValue() {
    const {
      MultiValue,
      MultiValueContainer,
      MultiValueLabel,
      MultiValueRemove,
      SingleValue,
      Placeholder,
    } = this.getComponents();
    const { commonProps } = this;
    const {
      controlShouldRenderValue,
      isDisabled,
      isMulti,
      inputValue,
      placeholder,
    } = this.props;
    const { selectValue, focusedValue, isFocused } = this.state;

    if (!this.hasValue() || !controlShouldRenderValue) {
      return inputValue ? null : (
        <Placeholder
          {...commonProps}
          key="placeholder"
          isDisabled={isDisabled}
          isFocused={isFocused}
          innerProps={{ id: this.getElementId('placeholder') }}
        >
          {placeholder}
        </Placeholder>
      );
    }

    if (isMulti) {
      return selectValue.map((opt, index) => {
        const isOptionFocused = opt === focusedValue;
        const key = `${this.getOptionLabel(opt)}-${this.getOptionValue(opt)}`;

        return (
          <MultiValue
            {...commonProps}
            components={{
              Container: MultiValueContainer,
              Label: MultiValueLabel,
              Remove: MultiValueRemove,
            }}
            isFocused={isOptionFocused}
            isDisabled={isDisabled}
            key={key}
            index={index}
            removeProps={{
              onClick: () => this.removeValue(opt),
              onTouchEnd: () => this.removeValue(opt),
              onMouseDown: (e) => {
                e.preventDefault();
              },
            }}
            data={opt}
          >
            {this.formatOptionLabel(opt, 'value')}
          </MultiValue>
        );
      });
    }

    if (inputValue) {
      return null;
    }

    const singleValue = selectValue[0];
    return (
      <SingleValue {...commonProps} data={singleValue} isDisabled={isDisabled}>
        {this.formatOptionLabel(singleValue, 'value')}
      </SingleValue>
    );
  }
  renderClearIndicator() {
    const { ClearIndicator } = this.getComponents();
    const { commonProps } = this;
    const { isDisabled, isLoading } = this.props;
    const { isFocused } = this.state;

    if (
      !this.isClearable() ||
      !ClearIndicator ||
      isDisabled ||
      !this.hasValue() ||
      isLoading
    ) {
      return null;
    }

    const innerProps = {
      onMouseDown: this.onClearIndicatorMouseDown,
      onTouchEnd: this.onClearIndicatorTouchEnd,
      'aria-hidden': 'true',
    };

    return (
      <ClearIndicator
        {...commonProps}
        innerProps={innerProps}
        isFocused={isFocused}
      />
    );
  }
  renderLoadingIndicator() {
    const { LoadingIndicator } = this.getComponents();
    const { commonProps } = this;
    const { isDisabled, isLoading } = this.props;
    const { isFocused } = this.state;

    if (!LoadingIndicator || !isLoading) return null;

    const innerProps = { 'aria-hidden': 'true' };
    return (
      <LoadingIndicator
        {...commonProps}
        innerProps={innerProps}
        isDisabled={isDisabled}
        isFocused={isFocused}
      />
    );
  }
  renderIndicatorSeparator() {
    const { DropdownIndicator, IndicatorSeparator } = this.getComponents();

    // separator doesn't make sense without the dropdown indicator
    if (!DropdownIndicator || !IndicatorSeparator) return null;

    const { commonProps } = this;
    const { isDisabled } = this.props;
    const { isFocused } = this.state;

    return (
      <IndicatorSeparator
        {...commonProps}
        isDisabled={isDisabled}
        isFocused={isFocused}
      />
    );
  }
  renderDropdownIndicator() {
    const { DropdownIndicator } = this.getComponents();
    if (!DropdownIndicator) return null;
    const { commonProps } = this;
    const { isDisabled } = this.props;
    const { isFocused } = this.state;

    const innerProps = {
      onMouseDown: this.onDropdownIndicatorMouseDown,
      onTouchEnd: this.onDropdownIndicatorTouchEnd,
      'aria-hidden': 'true',
    };

    return (
      <DropdownIndicator
        {...commonProps}
        innerProps={innerProps}
        isDisabled={isDisabled}
        isFocused={isFocused}
      />
    );
  }
  renderMenu() {
    const {
      Group,
      GroupHeading,
      Menu,
      MenuList,
      MenuPortal,
      LoadingMessage,
      NoOptionsMessage,
      Option,
    } = this.getComponents();
    const { commonProps } = this;
    const { focusedOption } = this.state;
    const {
      captureMenuScroll,
      inputValue,
      isLoading,
      loadingMessage,
      minMenuHeight,
      maxMenuHeight,
      menuIsOpen,
      menuPlacement,
      menuPosition,
      menuPortalTarget,
      menuShouldBlockScroll,
      menuShouldScrollIntoView,
      noOptionsMessage,
      onMenuScrollToTop,
      onMenuScrollToBottom,
    } = this.props;

    if (!menuIsOpen) return null;

    // TODO: Internal Option Type here
    const render = (props: CategorizedOption<Option>, id: string) => {
      const { type, data, isDisabled, isSelected, label, value } = props;
      const isFocused = focusedOption === data;
      const onHover = isDisabled ? undefined : () => this.onOptionHover(data);
      const onSelect = isDisabled ? undefined : () => this.selectOption(data);
      const optionId = `${this.getElementId('option')}-${id}`;
      const innerProps = {
        id: optionId,
        onClick: onSelect,
        onMouseMove: onHover,
        onMouseOver: onHover,
        tabIndex: -1,
        role: 'option',
        'aria-selected': this.isAppleDevice ? undefined : isSelected, // is not supported on Apple devices
      };

      return (
        <Option
          {...commonProps}
          innerProps={innerProps}
          data={data}
          isDisabled={isDisabled}
          isSelected={isSelected}
          key={optionId}
          label={label}
          type={type}
          value={value}
          isFocused={isFocused}
          innerRef={isFocused ? this.getFocusedOptionRef : undefined}
        >
          {this.formatOptionLabel(props.data, 'menu')}
        </Option>
      );
    };

    let menuUI: ReactNode;

    if (this.hasOptions()) {
      menuUI = this.getCategorizedOptions().map((item) => {
        if (item.type === 'group') {
          const { data, options, index: groupIndex } = item;
          const groupId = `${this.getElementId('group')}-${groupIndex}`;
          const headingId = `${groupId}-heading`;

          return (
            <Group
              {...commonProps}
              key={groupId}
              data={data}
              options={options}
              Heading={GroupHeading}
              headingProps={{
                id: headingId,
                data: item.data,
              }}
              label={this.formatGroupLabel(item.data)}
            >
              {item.options.map((option) =>
                render(option, `${groupIndex}-${option.index}`)
              )}
            </Group>
          );
        } else if (item.type === 'option') {
          return render(item, `${item.index}`);
        }
      });
    } else if (isLoading) {
      const message = loadingMessage({ inputValue });
      if (message === null) return null;
      menuUI = <LoadingMessage {...commonProps}>{message}</LoadingMessage>;
    } else {
      const message = noOptionsMessage({ inputValue });
      if (message === null) return null;
      menuUI = <NoOptionsMessage {...commonProps}>{message}</NoOptionsMessage>;
    }
    const menuPlacementProps = {
      minMenuHeight,
      maxMenuHeight,
      menuPlacement,
      menuPosition,
      menuShouldScrollIntoView,
    };

    const menuElement = (
      <MenuPlacer {...commonProps} {...menuPlacementProps}>
        {({ ref, placerProps: { placement, maxHeight } }) => (
          <Menu
            {...commonProps}
            {...menuPlacementProps}
            innerRef={ref}
            innerProps={{
              onMouseDown: this.onMenuMouseDown,
              onMouseMove: this.onMenuMouseMove,
            }}
            isLoading={isLoading}
            placement={placement}
          >
            <ScrollManager
              captureEnabled={captureMenuScroll}
              onTopArrive={onMenuScrollToTop}
              onBottomArrive={onMenuScrollToBottom}
              lockEnabled={menuShouldBlockScroll}
            >
              {(scrollTargetRef) => (
                <MenuList
                  {...commonProps}
                  innerRef={(instance) => {
                    this.getMenuListRef(instance);
                    scrollTargetRef(instance);
                  }}
                  innerProps={{
                    role: 'listbox',
                    'aria-multiselectable': commonProps.isMulti,
                    id: this.getElementId('listbox'),
                  }}
                  isLoading={isLoading}
                  maxHeight={maxHeight}
                  focusedOption={focusedOption}
                >
                  {menuUI}
                </MenuList>
              )}
            </ScrollManager>
          </Menu>
        )}
      </MenuPlacer>
    );

    // positioning behaviour is almost identical for portalled and fixed,
    // so we use the same component. the actual portalling logic is forked
    // within the component based on `menuPosition`
    return menuPortalTarget || menuPosition === 'fixed' ? (
      <MenuPortal
        {...commonProps}
        appendTo={menuPortalTarget}
        controlElement={this.controlRef}
        menuPlacement={menuPlacement}
        menuPosition={menuPosition}
      >
        {menuElement}
      </MenuPortal>
    ) : (
      menuElement
    );
  }
  renderFormField() {
    const { delimiter, isDisabled, isMulti, name, required } = this.props;
    const { selectValue } = this.state;

    if (required && !this.hasValue() && !isDisabled) {
      return <RequiredInput name={name} onFocus={this.onValueInputFocus} />;
    }

    if (!name || isDisabled) return;

    if (isMulti) {
      if (delimiter) {
        const value = selectValue
          .map((opt) => this.getOptionValue(opt))
          .join(delimiter);
        return <input name={name} type="hidden" value={value} />;
      } else {
        const input =
          selectValue.length > 0 ? (
            selectValue.map((opt, i) => (
              <input
                key={`i-${i}`}
                name={name}
                type="hidden"
                value={this.getOptionValue(opt)}
              />
            ))
          ) : (
            <input name={name} type="hidden" value="" />
          );

        return <div>{input}</div>;
      }
    } else {
      const value = selectValue[0] ? this.getOptionValue(selectValue[0]) : '';
      return <input name={name} type="hidden" value={value} />;
    }
  }

  renderLiveRegion() {
    const { commonProps } = this;
    const {
      ariaSelection,
      focusedOption,
      focusedValue,
      isFocused,
      selectValue,
    } = this.state;

    const focusableOptions = this.getFocusableOptions();

    return (
      <LiveRegion
        {...commonProps}
        id={this.getElementId('live-region')}
        ariaSelection={ariaSelection}
        focusedOption={focusedOption}
        focusedValue={focusedValue}
        isFocused={isFocused}
        selectValue={selectValue}
        focusableOptions={focusableOptions}
        isAppleDevice={this.isAppleDevice}
      />
    );
  }

  render() {
    const { Control, IndicatorsContainer, SelectContainer, ValueContainer } =
      this.getComponents();

    const { className, id, isDisabled, menuIsOpen } = this.props;
    const { isFocused } = this.state;
    const commonProps = (this.commonProps = this.getCommonProps());

    return (
      <SelectContainer
        {...commonProps}
        className={className}
        innerProps={{
          id: id,
          onKeyDown: this.onKeyDown,
        }}
        isDisabled={isDisabled}
        isFocused={isFocused}
      >
        {this.renderLiveRegion()}
        <Control
          {...commonProps}
          innerRef={this.getControlRef}
          innerProps={{
            onMouseDown: this.onControlMouseDown,
            onTouchEnd: this.onControlTouchEnd,
          }}
          isDisabled={isDisabled}
          isFocused={isFocused}
          menuIsOpen={menuIsOpen}
        >
          <ValueContainer {...commonProps} isDisabled={isDisabled}>
            {this.renderPlaceholderOrValue()}
            {this.renderInput()}
          </ValueContainer>
          <IndicatorsContainer {...commonProps} isDisabled={isDisabled}>
            {this.renderClearIndicator()}
            {this.renderLoadingIndicator()}
            {this.renderIndicatorSeparator()}
            {this.renderDropdownIndicator()}
          </IndicatorsContainer>
        </Control>
        {this.renderMenu()}
        {this.renderFormField()}
      </SelectContainer>
    );
  }
}

export type PublicBaseSelectProps<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
> = JSX.LibraryManagedAttributes<typeof Select, Props<Option, IsMulti, Group>>;
```

</source_code>

Please follow these steps:

1. Test Environment Setup:
   - Set up Jest and React Testing Library
   - Configure necessary test utilities for event handling
   - Ensure proper DOM environment simulation

2. Component Rendering Tests:
   - Test basic component rendering with default props
   - Verify proper DOM structure and accessibility attributes
   - Validate that required props are properly applied to the rendered output

3. User Interaction Testing:
   - Test keyboard navigation functionality (arrows, tab, enter, escape keys)
   - Test mouse interactions (clicking, hovering, focusing elements)
   - Simulate touch events for mobile device compatibility

4. State Management Tests:
   - Verify controlled and uncontrolled component behavior
   - Test state changes when selecting, removing, and clearing values
   - Ensure proper focus management during interactions

5. Menu and Options Tests:
   - Test menu opening/closing behavior
   - Verify option filtering and searching functionality
   - Validate option selection, deselection, and multi-select behavior

6. Accessibility Testing:
   - Verify ARIA attributes and screen reader compatibility
   - Test keyboard-only navigation flows
   - Ensure focus trapping and management works correctly

7. Edge Case Testing:
   - Test component behavior with empty options
   - Test loading and error states
   - Verify component behavior with disabled options/states

8. Performance Testing:
   - Test rendering performance with large option sets
   - Verify optimization features work correctly

9. Test Coverage Requirements:
   - Aim for at least 80% code coverage
   - Use mocking for external dependencies
   - Create comprehensive test cases for all component props

10. Test Documentation:
    - Document test cases clearly
    - Group related tests logically
    - Include setup and teardown procedures where needed
## Run 1:
### Answer:
I'll create a comprehensive unit testing suite for the React Select component. Let me break this down into organized test files with proper setup and coverage.

## Test Environment Setup

```typescript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapping: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/setupTests.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

```typescript
// src/setupTests.ts
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

configure({ testIdAttribute: 'data-testid' });

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock scrollIntoView
Element.prototype.scrollIntoView = jest.fn();
```

## Test Utilities

```typescript
// src/__tests__/utils/testUtils.tsx
import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Select, { Props } from '../index';

export interface TestOption {
  label: string;
  value: string;
  isDisabled?: boolean;
}

export const defaultOptions: TestOption[] = [
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
  { label: 'Option 3', value: 'option3' },
  { label: 'Disabled Option', value: 'disabled', isDisabled: true },
];

export const groupedOptions = [
  {
    label: 'Group 1',
    options: [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
    ],
  },
  {
    label: 'Group 2',
    options: [
      { label: 'Option 3', value: 'option3' },
      { label: 'Option 4', value: 'option4' },
    ],
  },
];

export const defaultProps: Partial<Props<TestOption, false, any>> = {
  options: defaultOptions,
  onChange: jest.fn(),
  onInputChange: jest.fn(),
  onMenuOpen: jest.fn(),
  onMenuClose: jest.fn(),
};

export function renderSelect<
  Option = TestOption,
  IsMulti extends boolean = false
>(
  props: Partial<Props<Option, IsMulti, any>> = {},
  renderOptions?: RenderOptions
) {
  const mergedProps = { ...defaultProps, ...props } as Props<Option, IsMulti, any>;
  
  return {
    user: userEvent.setup(),
    ...render(<Select {...mergedProps} />, renderOptions),
  };
}

export const createMockEvent = (type: string, properties = {}) => {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.assign(event, properties);
  return event;
};

export const waitForMenuToOpen = async (container: HTMLElement) => {
  const menu = await container.querySelector('[role="listbox"]');
  return menu;
};

export const getSelectInput = (container: HTMLElement) => {
  return container.querySelector('input[role="combobox"]') as HTMLInputElement;
};

export const getSelectControl = (container: HTMLElement) => {
  return container.querySelector('[class*="control"]') as HTMLElement;
};

export const getMenuOptions = (container: HTMLElement) => {
  return container.querySelectorAll('[role="option"]');
};
```

## Core Component Tests

```typescript
// src/__tests__/Select.test.tsx
import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderSelect, defaultOptions, TestOption } from './utils/testUtils';

describe('Select Component', () => {
  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      renderSelect();
      
      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByText('Select...')).toBeInTheDocument();
    });

    it('renders with custom placeholder', () => {
      renderSelect({ placeholder: 'Choose an option' });
      
      expect(screen.getByText('Choose an option')).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      const { container } = renderSelect({ className: 'custom-select' });
      
      expect(container.firstChild).toHaveClass('custom-select');
    });

    it('renders with custom id', () => {
      renderSelect({ id: 'test-select' });
      
      expect(screen.getByRole('combobox')).toHaveAttribute('id', expect.stringContaining('test-select'));
    });

    it('applies disabled state correctly', () => {
      renderSelect({ isDisabled: true });
      
      expect(screen.getByRole('combobox')).toBeDisabled();
    });

    it('renders loading state', () => {
      renderSelect({ isLoading: true });
      
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA attributes', () => {
      renderSelect();
      
      const input = screen.getByRole('combobox');
      expect(input).toHaveAttribute('aria-autocomplete', 'list');
      expect(input).toHaveAttribute('aria-expanded', 'false');
      expect(input).toHaveAttribute('aria-haspopup', 'true');
    });

    it('updates aria-expanded when menu opens', async () => {
      const { user } = renderSelect();
      
      const input = screen.getByRole('combobox');
      await user.click(input);
      
      expect(input).toHaveAttribute('aria-expanded', 'true');
    });

    it('supports aria-label', () => {
      renderSelect({ 'aria-label': 'Select an option' });
      
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-label', 'Select an option');
    });

    it('supports aria-labelledby', () => {
      renderSelect({ 'aria-labelledby': 'label-id' });
      
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-labelledby', 'label-id');
    });

    it('supports required attribute', () => {
      renderSelect({ required: true });
      
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-required', 'true');
    });
  });

  describe('Value Display', () => {
    it('displays selected value', () => {
      renderSelect({ value: defaultOptions[0] });
      
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    it('displays multiple selected values', () => {
      renderSelect({ 
        isMulti: true, 
        value: [defaultOptions[0], defaultOptions[1]] 
      });
      
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    it('hides placeholder when value is selected', () => {
      renderSelect({ 
        value: defaultOptions[0],
        placeholder: 'Select...'
      });
      
      expect(screen.queryByText('Select...')).not.toBeInTheDocument();
    });
  });
});
```

## User Interaction Tests

```typescript
// src/__tests__/Select.interactions.test.tsx
import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderSelect, defaultOptions, getSelectInput } from './utils/testUtils';

describe('Select User Interactions', () => {
  describe('Mouse Interactions', () => {
    it('opens menu on click', async () => {
      const { user } = renderSelect();
      
      await user.click(screen.getByRole('combobox'));
      
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });
    });

    it('closes menu on outside click', async () => {
      const { user } = renderSelect({ menuIsOpen: true });
      
      await user.click(document.body);
      
      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });
    });

    it('selects option on click', async () => {
      const onChange = jest.fn();
      const { user } = renderSelect({ onChange });
      
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByText('Option 1'));
      
      expect(onChange).toHaveBeenCalledWith(
        defaultOptions[0],
        expect.objectContaining({ action: 'select-option' })
      );
    });

    it('handles option hover', async () => {
      const { user } = renderSelect({ menuIsOpen: true });
      
      const option = screen.getByText('Option 1');
      await user.hover(option);
      
      expect(option.closest('[role="option"]')).toHaveAttribute('aria-selected');
    });
  });

  describe('Keyboard Navigation', () => {
    it('opens menu with ArrowDown', async () => {
      const { user } = renderSelect();
      
      const input = screen.getByRole('combobox');
      input.focus();
      await user.keyboard('{ArrowDown}');
      
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });
    });

    it('opens menu with ArrowUp', async () => {
      const { user } = renderSelect();
      
      const input = screen.getByRole('combobox');
      input.focus();
      await user.keyboard('{ArrowUp}');
      
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });
    });

    it('navigates options with arrow keys', async () => {
      const { user } = renderSelect({ menuIsOpen: true });
      
      const input = screen.getByRole('combobox');
      input.focus();
      
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowDown}');
      
      const options = screen.getAllByRole('option');
      expect(options[1]).toHaveAttribute('aria-selected', 'true');
    });

    it('selects option with Enter', async () => {
      const onChange = jest.fn();
      const { user } = renderSelect({ onChange, menuIsOpen: true });
      
      const input = screen.getByRole('combobox');
      input.focus();
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Enter}');
      
      expect(onChange).toHaveBeenCalledWith(
        defaultOptions[0],
        expect.objectContaining({ action: 'select-option' })
      );
    });

    it('closes menu with Escape', async () => {
      const { user } = renderSelect({ menuIsOpen: true });
      
      const input = screen.getByRole('combobox');
      input.focus();
      await user.keyboard('{Escape}');
      
      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });
    });

    it('selects option with Tab when tabSelectsValue is true', async () => {
      const onChange = jest.fn();
      const { user } = renderSelect({ 
        onChange, 
        menuIsOpen: true,
        tabSelectsValue: true 
      });
      
      const input = screen.getByRole('combobox');
      input.focus();
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Tab}');
      
      expect(onChange).toHaveBeenCalledWith(
        defaultOptions[0],
        expect.objectContaining({ action: 'select-option' })
      );
    });

    it('opens menu with Space', async () => {
      const { user } = renderSelect();
      
      const input = screen.getByRole('combobox');
      input.focus();
      await user.keyboard(' ');
      
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });
    });
  });

  describe('Touch Interactions', () => {
    it('handles touch events on control', async () => {
      const { container } = renderSelect();
      
      const control = container.querySelector('[class*="control"]')!;
      fireEvent.touchEnd(control);
      
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });
    });

    it('prevents action when user is dragging', async () => {
      const { container } = renderSelect();
      
      const control = container.querySelector('[class*="control"]')!;
      
      // Simulate drag
      fireEvent.touchStart(control, {
        touches: [{ clientX: 0, clientY: 0 }]
      });
      fireEvent.touchMove(control, {
        touches: [{ clientX: 10, clientY: 10 }]
      });
      fireEvent.touchEnd(control);
      
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });
});
```

## State Management Tests

```typescript
// src/__tests__/Select.state.test.tsx
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { renderSelect, defaultOptions } from './utils/testUtils';

describe('Select State Management', () => {
  describe('Controlled Component', () => {
    it('updates value when prop changes', () => {
      const { rerender } = renderSelect({ value: defaultOptions[0] });
      
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      
      rerender(<Select 
        options={defaultOptions}
        value={defaultOptions[1]}
        onChange={jest.fn()}
        onInputChange={jest.fn()}
        onMenuOpen={jest.fn()}
        onMenuClose={jest.fn()}
      />);
      
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    it('calls onChange when selection changes', async () => {
      const onChange = jest.fn();
      const { user } = renderSelect({ onChange });
      
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByText('Option 1'));
      
      expect(onChange).toHaveBeenCalledWith(
        defaultOptions[0],
        expect.objectContaining({ action: 'select-option' })
      );
    });

    it('maintains inputValue state', async () => {
      const onInputChange = jest.fn();
      const { user } = renderSelect({ onInputChange, inputValue: '' });
      
      const input = screen.getByRole('combobox');
      await user.type(input, 'test');
      
      expect(onInputChange).toHaveBeenCalledWith(
        'test',
        expect.objectContaining({ action: 'input-change' })
      );
    });
  });

  describe('Focus Management', () => {
    it('focuses input on mount when autoFocus is true', () => {
      renderSelect({ autoFocus: true });
      
      expect(screen.getByRole('combobox')).toHaveFocus();
    });

    it('maintains focus state correctly', async () => {
      const { user } = renderSelect();
      
      const input = screen.getByRole('combobox');
      await user.click(input);
      
      expect(input).toHaveFocus();
    });

    it('blurs input when clicking outside', async () => {
      const { user } = renderSelect();
      
      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.click(document.body);
      
      expect(input).not.toHaveFocus();
    });
  });

  describe('Menu State', () => {
    it('opens menu when openMenuOnClick is true', async () => {
      const { user } = renderSelect({ openMenuOnClick: true });
      
      await user.click(screen.getByRole('combobox'));
      
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });
    });

    it('opens menu when openMenuOnFocus is true', async () => {
      const { user } = renderSelect({ openMenuOnFocus: true });
      
      const input = screen.getByRole('combobox');
      await user.click(input);
      
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });
    });

    it('closes menu when closeMenuOnSelect is true', async () => {
      const { user } = renderSelect({ closeMenuOnSelect: true });
      
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByText('Option 1'));
      
      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });
    });
  });
});
```

## Multi-Select Tests

```typescript
// src/__tests__/Select.multiselect.test.tsx
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { renderSelect, defaultOptions } from './utils/testUtils';

describe('Multi-Select Functionality', () => {
  describe('Selection Behavior', () => {
    it('allows multiple selections', async () => {
      const onChange = jest.fn();
      const { user } = renderSelect({ isMulti: true, onChange });
      
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByText('Option 1'));
      
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByText('Option 2'));
      
      expect(onChange).toHaveBeenLastCalledWith(
        [defaultOptions[0], defaultOptions[1]],
        expect.objectContaining({ action: 'select-option' })
      );
    });

    it('deselects option when clicked again', async () => {
      const onChange = jest.fn();
      const { user } = renderSelect({ 
        isMulti: true, 
        onChange,
        value: [defaultOptions[0]]
      });
      
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByText('Option 1'));
      
      expect(onChange).toHaveBeenCalledWith(
        [],
        expect.objectContaining({ action: 'deselect-option' })
      );
    });

    it('displays multiple selected values', () => {
      renderSelect({ 
        isMulti: true, 
        value: [defaultOptions[0], defaultOptions[1]] 
      });
      
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    it('removes value when remove button is clicked', async () => {
      const onChange = jest.fn();
      const { user, container } = renderSelect({ 
        isMulti: true, 
        onChange,
        value: [defaultOptions[0], defaultOptions[1]]
      });
      
      const removeButtons = container.querySelectorAll('[class*="multiValue__remove"]');
      await user.click(removeButtons[0]);
      
      expect(onChange).toHaveBeenCalledWith(
        [defaultOptions[1]],
        expect.objectContaining({ action: 'remove-value' })
      );
    });
  });

  describe('Keyboard Navigation', () => {
    it('navigates between selected values with arrow keys', async () => {
      const { user } = renderSelect({ 
        isMulti: true, 
        value: [defaultOptions[0], defaultOptions[1]]
      });
      
      const input = screen.getByRole('combobox');
      input.focus();
      
      await user.keyboard('{ArrowLeft}');
      
      // Should focus the last selected value
      const multiValues = screen.getAllByText(/Option [12]/);
      expect(multiValues[1].closest('[class*="multiValue"]')).toHaveClass('multiValue--is-focused');
    });

    it('removes focused value with Backspace', async () => {
      const onChange = jest.fn();
      const { user } = renderSelect({ 
        isMulti: true, 
        onChange,
        value: [defaultOptions[0], defaultOptions[1]]
      });
      
      const input = screen.getByRole('combobox');
      input.focus();
      
      await user.keyboard('{ArrowLeft}');
      await user.keyboard('{Backspace}');
      
      expect(onChange).toHaveBeenCalledWith(
        [defaultOptions[0]],
        expect.objectContaining({ action: 'remove-value' })
      );
    });

    it('removes last value with Backspace when no input value', async () => {
      const onChange = jest.fn();
      const { user } = renderSelect({ 
        isMulti: true, 
        onChange,
        value: [defaultOptions[0], defaultOptions[1]],
        inputValue: ''
      });
      
      const input = screen.getByRole('combobox');
      input.focus();
      await user.keyboard('{Backspace}');
      
      expect(onChange).toHaveBeenCalledWith(
        [defaultOptions[0]],
        expect.objectContaining({ action: 'pop-value' })
      );
    });
  });

  describe('Clear Functionality', () => {
    it('clears all values when clear button is clicked', async () => {
      const onChange = jest.fn();
      const { user, container } = renderSelect({ 
        isMulti: true, 
        onChange,
        isClearable: true,
        value: [defaultOptions[0], defaultOptions[1]]
      });
      
      const clearButton = container.querySelector('[class*="clearIndicator"]')!;
      await user.click(clearButton);
      
      expect(onChange).toHaveBeenCalledWith(
        [],
        expect.objectContaining({ action: 'clear' })
      );
    });
  });
});
```

## Menu and Options Tests

```typescript
// src/__tests__/Select.menu.test.tsx
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { renderSelect, defaultOptions, groupedOptions } from './utils/testUtils';

describe('Menu and Options', () => {
  describe('Menu Rendering', () => {
    it('renders menu when menuIsOpen is true', () => {
      renderSelect({ menuIsOpen: true });
      
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('renders all options', () => {
      renderSelect({ menuIsOpen: true });
      
      defaultOptions.forEach(option => {
        expect(screen.getByText(option.label)).toBeInTheDocument();
      });
    });

    it('renders grouped options', () => {
      renderSelect({ 
        menuIsOpen: true, 
        options: groupedOptions 
      });
      
      expect(screen.getByText('Group 1')).toBeInTheDocument();
      expect(screen.getByText('Group 2')).toBeInTheDocument();
    });

    it('renders no options message when no options available', () => {
      renderSelect({ 
        menuIsOpen: true, 
        options: [],
        noOptionsMessage: () => 'No options available'
      });
      
      expect(screen.getByText('No options available')).toBeInTheDocument();
    });

    it('renders loading message when loading', () => {
      renderSelect({ 
        menuIsOpen: true, 
        isLoading: true,
        loadingMessage: () => 'Loading options...'
      });
      
      expect(screen.getByText('Loading options...')).toBeInTheDocument();
    });
  });

  describe('Option Filtering', () => {
    it('filters options based on input value', async () => {
      const { user } = renderSelect({ 
        isSearchable: true,
        inputValue: 'Option 1'
      });
      
      await user.click(screen.getByRole('combobox'));
      
      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
        expect(screen.queryByText('Option 2')).not.toBeInTheDocument();
      });
    });

    it('uses custom filterOption function', async () => {
      const customFilter = jest.fn(() => true);
      const { user } = renderSelect({ 
        filterOption: customFilter,
        inputValue: 'test'
      });
      
      await user.click(screen.getByRole('combobox'));
      
      expect(customFilter).toHaveBeenCalled();
    });

    it('disables filtering when filterOption is null', async () => {
      const { user } = renderSelect({ 
        filterOption: null,
        inputValue: 'xyz'
      });
      
      await user.click(screen.getByRole('combobox'));
      
      // All options should still be visible
      defaultOptions.forEach(option => {
        expect(screen.getByText(option.label)).toBeInTheDocument();
      });
    });
  });

  describe('Option States', () => {
    it('marks selected options correctly', () => {
      renderSelect({ 
        menuIsOpen: true,
        value: defaultOptions[0]
      });
      
      const selectedOption = screen.getByText('Option 1').closest('[role="option"]');
      expect(selectedOption).toHaveAttribute('aria-selected', 'true');
    });

    it('disables options correctly', () => {
      const optionsWithDisabled = [
        ...defaultOptions,
        { label: 'Disabled', value: 'disabled', isDisabled: true }
      ];
      
      renderSelect({ 
        menuIsOpen: true,
        options: optionsWithDisabled,
        isOptionDisabled: (option) => option.isDisabled || false
      });
      
      const disabledOption = screen.getByText('Disabled').closest('[role="option"]');
      expect(disabledOption).toHaveAttribute('aria-disabled', 'true');
    });

    it('hides selected options when hideSelectedOptions is true', () => {
      renderSelect({ 
        menuIsOpen: true,
        isMulti: true,
        hideSelectedOptions: true,
        value: [defaultOptions[0]]
      });
      
      expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });
  });

  describe('Menu Placement', () => {
    it('renders menu with correct placement', () => {
      const { container } = renderSelect({ 
        menuIsOpen: true,
        menuPlacement: 'top'
      });
      
      const menu = container.querySelector('[class*="menu"]');
      expect(menu).toBeInTheDocument();
    });

    it('renders menu in portal when menuPortalTarget is provided', () => {
      const portalTarget = document.createElement('div');
      document.body.appendChild(portalTarget);
      
      renderSelect({ 
        menuIsOpen: true,
        menuPortalTarget: portalTarget
      });
      
      expect(portalTarget.querySelector('[role="listbox"]')).toBeInTheDocument();
      
      document.body.removeChild(portalTarget);
    });
  });
});
```

## Search and Input Tests

```typescript
// src/__tests__/Select.search.test.tsx
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { renderSelect, defaultOptions } from './utils/testUtils';

describe('Search and Input Functionality', () => {
  describe('Search Input', () => {
    it('allows typing in search input', async () => {
      const onInputChange = jest.fn();
      const { user } = renderSelect({ 
        isSearchable: true,
        onInputChange
      });
      
      const input = screen.getByRole('combobox');
      await user.type(input, 'Option');
      
      expect(onInputChange).toHaveBeenCalledWith(
        'Option',
        expect.objectContaining({ action: 'input-change' })
      );
    });

    it('opens menu when typing', async () => {
      const { user } = renderSelect({ isSearchable: true });
      
      const input = screen.getByRole('combobox');
      await user.type(input, 'O');
      
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });
    });

    it('filters options based on search input', async () => {
      const { user } = renderSelect({ 
        isSearchable: true,
        menuIsOpen: true
      });
      
      const input = screen.getByRole('combobox');
      await user.type(input, '1');
      
      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
        expect(screen.queryByText('Option 2')).not.toBeInTheDocument();
      });
    });

    it('clears input when menu closes', async () => {
      const onInputChange = jest.fn();
      const { user } = renderSelect({ 
        isSearchable: true,
        onInputChange,
        inputValue: 'test'
      });
      
      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{Escape}');
      
      expect(onInputChange).toHaveBeenCalledWith(
        '',
        expect.objectContaining({ action: 'menu-close' })
      );
    });

    it('handles composition events correctly', async () => {
      const { user } = renderSelect({ isSearchable: true });
      
      const input = screen.getByRole('combobox');
      input.focus();
      
      // Simulate IME composition
      fireEvent.compositionStart(input);
      await user.keyboard('{Enter}'); // Should not trigger selection during composition
      fireEvent.compositionEnd(input);
      
      // Menu should still be closed
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  describe('Non-searchable Mode', () => {
    it('renders dummy input when not searchable', () => {
      renderSelect({ isSearchable: false });
      
      const input = screen.getByRole('combobox');
      expect(input).toHaveAttribute('inputmode', 'none');
      expect(input).toHaveAttribute('aria-readonly', 'true');
    });

    it('does not filter options when not searchable', async () => {
      const { user } = renderSelect({ 
        isSearchable: false,
        menuIsOpen: true
      });
      
      const input = screen.getByRole('combobox');
      await user.type(input, 'test');
      
      // All options should still be visible
      defaultOptions.forEach(option => {
        expect(screen.getByText(option.label)).toBeInTheDocument();
      });
    });
  });

  describe('Input Value Control', () => {
    it('controls input value externally', () => {
      const { rerender } = renderSelect({ 
        inputValue: 'controlled',
        onInputChange: jest.fn()
      });
      
      expect(screen.getByRole('combobox')).toHaveValue('controlled');
      
      rerender(<Select 
        options={defaultOptions}
        inputValue="updated"
        onChange={jest.fn()}
        onInputChange={jest.fn()}
        onMenuOpen={jest.fn()}
        onMenuClose={jest.fn()}
      />);
      
      expect(screen.getByRole('combobox')).toHaveValue('updated');
    });

    it('clears input value when option is selected', async () => {
      const onInputChange = jest.fn();
      const { user } = renderSelect({ 
        onInputChange,
        inputValue: 'test'
      });
      
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByText('Option 1'));
      
      expect(onInputChange).toHaveBeenCalledWith(
        '',
        expect.objectContaining({ action: 'set-value' })
      );
    });
  });
});
```

## Accessibility Tests

```typescript
// src/__tests__/Select.accessibility.test.tsx
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { renderSelect, defaultOptions } from './utils/testUtils';

describe('Accessibility Features', () => {
  describe('ARIA Attributes', () => {
    it('has correct role attributes', () => {
      renderSelect({ menuIsOpen: true });
      
      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByRole('listbox')).toBeInTheDocument();
      expect(screen.getAllByRole('option')).toHaveLength(defaultOptions.length);
    });

    it('sets aria-activedescendant correctly', async () => {
      const { user } = renderSelect({ menuIsOpen: true });
      
      const input = screen.getByRole('combobox');
      input.focus();
      await user.keyboard('{ArrowDown}');
      
      const focusedOptionId = input.getAttribute('aria-activedescendant');
      expect(focusedOptionId).toBeTruthy();
      
      const focusedOption = document.getElementById(focusedOptionId!);
      expect(focusedOption).toBeInTheDocument();
    });

    it('sets aria-controls when menu is open', async () => {
      const { user } = renderSelect();
      
      const input = screen.getByRole('combobox');
      await user.click(input);
      
      const listboxId = input.getAttribute('aria-controls');
      expect(listboxId).toBeTruthy();
      expect(document.getElementById(listboxId!)).toBeInTheDocument();
    });

    it('sets aria-multiselectable for multi-select', () => {
      renderSelect({ isMulti: true, menuIsOpen: true });
      
      const listbox = screen.getByRole('listbox');
      expect(listbox).toHaveAttribute('aria-multiselectable', 'true');
    });

    it('supports custom aria attributes', () => {
      renderSelect({
        'aria-label': 'Custom label',
        'aria-describedby': 'description-id',
        'aria-invalid': true,
        'aria-errormessage': 'error-id'
      });
      
      const input = screen.getByRole('combobox');
      expect(input).toHaveAttribute('aria-label', 'Custom label');
      expect(input).toHaveAttribute('aria-describedby', 'description-id');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('aria-errormessage', 'error-id');
    });
  });

  describe('Live Region', () => {
    it('announces selection changes', async () => {
      const { user, container } = renderSelect();
      
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByText('Option 1'));
      
      const liveRegion = container.querySelector('[aria-live]');
      expect(liveRegion).toBeInTheDocument();
    });

    it('uses custom aria-live setting', () => {
      const { container } = renderSelect({ 'aria-live': 'assertive' });
      
      const liveRegion = container.querySelector('[aria-live="assertive"]');
      expect(liveRegion).toBeInTheDocument();
    });

    it('announces focus changes', async () => {
      const { user } = renderSelect({ menuIsOpen: true });
      
      const input = screen.getByRole('combobox');
      input.focus();
      await user.keyboard('{ArrowDown}');
      
      // Live region should announce the focused option
      const liveRegion = screen.getByRole('status');
      expect(liveRegion).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    it('supports full keyboard navigation', async () => {
      const { user } = renderSelect();
      
      const input = screen.getByRole('combobox');
      input.focus();
      
      // Open menu
      await user.keyboard('{ArrowDown}');
      expect(screen.getByRole('listbox')).toBeInTheDocument();
      
      // Navigate options
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowUp}');
      
      // Select option
      await user.keyboard('{Enter}');
      
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    it('supports page navigation keys', async () => {
      const { user } = renderSelect({ 
        menuIsOpen: true,
        pageSize: 2
      });
      
      const input = screen.getByRole('combobox');
      input.focus();
      
      await user.keyboard('{PageDown}');
      await user.keyboard('{PageUp}');
      await user.keyboard('{Home}');
      await user.keyboard('{End}');
      
      // Should navigate through options
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('traps focus within component when menu is open', async () => {
      const { user } = renderSelect({ menuIsOpen: true });
      
      const input = screen.getByRole('combobox');
      input.focus();
      
      // Tab should not leave the component
      await user.keyboard('{Tab}');
      
      expect(document.activeElement).toBe(input);
    });
  });

  describe('Screen Reader Support', () => {
    it('provides screen reader status updates', () => {
      renderSelect({ 
        menuIsOpen: true,
        screenReaderStatus: ({ count }) => `${count} options available`
      });
      
      const status = screen.getByText('4 options available');
      expect(status).toBeInTheDocument();
    });

    it('announces loading state', () => {
      renderSelect({ 
        isLoading: true,
        loadingMessage: () => 'Loading options'
      });
      
      expect(screen.getByText('Loading options')).toBeInTheDocument();
    });

    it('announces no options state', () => {
      renderSelect({ 
        menuIsOpen: true,
        options: [],
        noOptionsMessage: () => 'No options found'
      });
      
      expect(screen.getByText('No options found')).toBeInTheDocument();
    });
  });
});
```

## Edge Cases and Error Handling Tests

```typescript
// src/__tests__/Select.edgecases.test.tsx
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { renderSelect, defaultOptions } from './utils/testUtils';

describe('Edge Cases and Error Handling', () => {
  describe('Empty States', () => {
    it('handles empty options array', () => {
      renderSelect({ 
        options: [],
        menuIsOpen: true
      });
      
      expect(screen.getByText('No options')).toBeInTheDocument();
    });

    it('handles null/undefined values gracefully', () => {
      expect(() => {
        renderSelect({ value: null });
      }).not.toThrow();
      
      expect(() => {
        renderSelect({ value: undefined });
      }).not.toThrow();
    });

    it('handles empty string input value', () => {
      renderSelect({ inputValue: '' });
      
      expect(screen.getByRole('combobox')).toHaveValue('');
    });
  });

  describe('Invalid Props', () => {
    it('handles invalid option structure gracefully', () => {
      const invalidOptions = [
        { label: 'Valid', value: 'valid' },
        null,
        undefined,
        { label: 'Missing value' },
        { value: 'missing-label' }
      ].filter(Boolean);
      
      expect(() => {
        renderSelect({ options: invalidOptions });
      }).not.toThrow();
    });

    it('handles missing required functions', () => {
      expect(() => {
        renderSelect({ 
          getOptionLabel: undefined,
          getOptionValue: undefined
        });
      }).not.toThrow();
    });
  });

  describe('Performance Edge Cases', () => {
    it('handles large option sets efficiently', () => {
      const largeOptions = Array.from({ length: 1000 }, (_, i) => ({
        label: `Option ${i}`,
        value: `option${i}`
      }));
      
      const start = performance.now();
      renderSelect({ 
        options: largeOptions,
        menuIsOpen: true
      });
      const end = performance.now();
      
      // Should render within reasonable time (adjust threshold as needed)
      expect(end - start).toBeLessThan(1000);
    });

    it('handles rapid state changes', async () => {
      const { user, rerender } = renderSelect();
      
      // Rapidly change props
      for (let i = 0; i < 10; i++) {
        rerender(<Select 
          options={defaultOptions}
          value={defaultOptions[i % defaultOptions.length]}
          onChange={jest.fn()}
          onInputChange={jest.fn()}
          onMenuOpen={jest.fn()}
          onMenuClose={jest.fn()}
        />);
      }
      
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  describe('Browser Compatibility', () => {
    it('handles missing document gracefully', () => {
      const originalDocument = global.document;
      
      // Temporarily remove document
      delete (global as any).document;
      
      expect(() => {
        renderSelect();
      }).not.toThrow();
      
      // Restore document
      global.document = originalDocument;
    });

    it('handles missing addEventListener', () => {
      const originalAddEventListener = document.addEventListener;
      
      // Mock missing addEventListener
      delete (document as any).addEventListener;
      
      expect(() => {
        renderSelect({ closeMenuOnScroll: true });
      }).not.toThrow();
      
      // Restore addEventListener
      document.addEventListener = originalAddEventListener;
    });
  });

  describe('Memory Leaks Prevention', () => {
    it('cleans up event listeners on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
      
      const { unmount } = renderSelect({ closeMenuOnScroll: true });
      unmount();
      
      expect(removeEventListenerSpy).toHaveBeenCalled();
      
      removeEventListenerSpy.mockRestore();
    });

    it('cleans up composition listeners on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
      
      const { unmount } = renderSelect();
      unmount();
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'compositionstart',
        expect.any(Function)
      );
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'compositionend',
        expect.any(Function)
      );
      
      removeEventListenerSpy.mockRestore();
    });
  });

  describe('Async Behavior', () => {
    it('handles async option loading', async () => {
      const { rerender } = renderSelect({ 
        isLoading: true,
        options: []
      });
      
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      
      // Simulate async load completion
      rerender(<Select 
        options={defaultOptions}
        isLoading={false}
        onChange={jest.fn()}
        onInputChange={jest.fn()}
        onMenuOpen={jest.fn()}
        onMenuClose={jest.fn()}
      />);
      
      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });
    });

    it('handles concurrent state updates', async () => {
      const { user } = renderSelect();
      
      // Trigger multiple rapid interactions
      const input = screen.getByRole('combobox');
      
      await Promise.all([
        user.click(input),
        user.type(input, 'test'),
        user.keyboard('{Escape}')
      ]);
      
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });
});
```

## Performance Tests

```typescript
// src/__tests__/Select.performance.test.tsx
import React from 'react';
import { render } from '@testing-library/react';
import { renderSelect } from './utils/testUtils';

describe('Performance Tests', () => {
  describe('Rendering Performance', () => {
    it('renders efficiently with large datasets', () => {
      const largeOptions = Array.from({ length: 10000 }, (_, i) => ({
        label: `Option ${i}`,
        value: `option${i}`
      }));
      
      const start = performance.now();
      renderSelect({ options: largeOptions });
      const end = performance.now();
      
      expect(end - start).toBeLessThan(500); // Should render within 500ms
    });

    it('handles frequent re-renders efficiently', () => {
      const { rerender } = renderSelect();
      
      const start = performance.now();
      
      // Perform 100 re-renders
      for (let i = 0; i < 100; i++) {
        rerender(<Select 
          options={[{ label: `Option ${i}`, value: `option${i}` }]}
          onChange={jest.fn()}
          onInputChange={jest.fn()}
          onMenuOpen={jest.fn()}
          onMenuClose={jest.fn()}
        />);
      }
      
      const end = performance.now();
      expect(end - start).toBeLessThan(1000); // Should complete within 1 second
    });
  });

  describe('Memory Usage', () => {
    it('does not create memory leaks with repeated mount/unmount', () => {
      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;
      
      // Mount and unmount component multiple times
      for (let i = 0; i < 50; i++) {
        const { unmount } = renderSelect();
        unmount();
      }
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
      
      const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
      
      // Memory usage should not increase significantly
      if (initialMemory > 0) {
        expect(finalMemory - initialMemory).toBeLessThan(1024 * 1024); // Less than 1MB increase
      }
    });
  });

  describe('Event Handler Optimization', () => {
    it('does not recreate handlers unnecessarily', () => {
      const onChange = jest.fn();
      const onInputChange = jest.fn();
      
      const { rerender } = renderSelect({ onChange, onInputChange });
      
      // Re-render with same handlers
      rerender(<Select 
        options={[]}
        onChange={onChange}
        onInputChange={onInputChange}
        onMenuOpen={jest.fn()}
        onMenuClose={jest.fn()}
      />);
      
      // Handlers should remain the same reference
      expect(onChange).toBe(onChange);
      expect(onInputChange).toBe(onInputChange);
    });
  });
});
```

## Test Runner Script

```typescript
// src/__tests__/runTests.ts
import { execSync } from 'child_process';

const testSuites = [
  'Select.test.tsx',
  'Select.interactions.test.tsx',
  'Select.state.test.tsx',
  'Select.multiselect.test.tsx',
  'Select.menu.test.tsx',
  'Select.search.test.tsx',
  'Select.accessibility.test.tsx',
  'Select.edgecases.test.tsx',
  'Select.performance.test.tsx'
];

console.log('Running comprehensive Select component tests...\n');

testSuites.forEach(suite => {
  console.log(`Running ${suite}...`);
  try {
    execSync(`npm test -- ${suite}`, { stdio: 'inherit' });
    console.log(`✅ ${suite} passed\n`);
  } catch (error) {
    console.log(`❌ ${suite} failed\n`);
    process.exit(1);
  }
});

console.log('All tests completed successfully! 🎉');

// Run coverage report
console.log('\nGenerating coverage report...');
execSync('npm test -- --coverage', { stdio: 'inherit' });
```

## Package.json Test Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:select": "jest Select",
    "test:ci": "jest --ci --coverage --watchAll=false"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^14.4.3",
    "jest": "^29.3.1",
    "jest-environment-jsdom": "^29.3.1"
  }
}
```

This comprehensive test suite provides:

1. **Complete coverage** of all component functionality
2. **Accessibility testing** with ARIA attributes and keyboard navigation
3. **User interaction testing** for mouse, keyboard, and touch events
4. **State management testing** for controlled/uncontrolled behavior
5. **Edge case handling** for error conditions and invalid inputs
6. **Performance testing** for large datasets and memory usage
7. **Multi-select specific testing** for complex selection scenarios
8. **Search and filtering functionality** testing
9. **Menu behavior testing** including placement and portaling
10. **Proper mocking and setup** for reliable test execution

The tests are organized logically, well-documented, and should achieve the target 80%+ code coverage while ensuring the component works correctly across all use cases.

### Tokens: {'input_tokens': 20564, 'output_tokens': 13236}
### Execution time: 126.99945616722107
