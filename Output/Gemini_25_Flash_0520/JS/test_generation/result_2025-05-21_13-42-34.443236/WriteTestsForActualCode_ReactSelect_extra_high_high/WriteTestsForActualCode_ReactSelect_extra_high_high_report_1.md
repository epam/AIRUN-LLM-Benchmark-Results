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
The provided `Select` component is a complex and feature-rich React component. To ensure comprehensive unit testing, we will follow the outlined steps, focusing on isolating the component's logic and interactions.

**1. Test Environment Setup**

*   **Jest and React Testing Library (RTL):** These are the core tools. Jest for the test runner, RTL for user-centric testing.
*   **`jest-dom`:** Provides custom matchers for DOM assertions.
*   **Mocks:** Crucial for isolating the `Select` component. We'll mock:
    *   Internal utility functions (`isTouchCapable`, `isMobileDevice`, `scrollIntoView`, `cleanValue`, `classNames`, `valueTernary`, `multiValueAsValue`, `singleValueAsValue`, `notNullish`).
    *   Filter functions (`createFilter`).
    *   Accessibility helpers (`isAppleDevice`).
    *   Built-in formatters/getters (`formatGroupLabelBuiltin`, `getOptionLabelBuiltin`, `getOptionValueBuiltin`, `isOptionDisabledBuiltin`).
    *   Child components (`MenuPlacer`, `LiveRegion`, `DummyInput`, `ScrollManager`, `RequiredInput`, and all components returned by `defaultComponents`).
    *   Global `document.addEventListener`/`removeEventListener` for scroll and composition events.
    *   `document.activeElement` for focus management tests.
    *   The internal `instanceId` counter to ensure predictable IDs for `aria-activedescendant` and other ID-based assertions.

**Project Structure for Tests and Mocks:**

```
src/
├── accessibility/
│   ├── helpers.ts
│   └── index.ts
├── builtins.ts
├── components/
│   ├── index.ts
│   ├── LiveRegion.tsx
│   └── Menu.tsx
├── filters.ts
├── internal/
│   └── index.ts
├── styles.ts
├── theme.ts
├── types.ts
├── utils.ts
└── index.tsx  <-- The Select component
src/__mocks__/
├── react-select/
│   ├── accessibility/
│   │   ├── helpers.ts
│   │   └── index.ts
│   ├── builtins.ts
│   ├── components/
│   │   ├── index.ts
│   │   ├── LiveRegion.tsx
│   │   └── Menu.tsx
│   ├── filters.ts
│   ├── internal/
│   │   └── index.ts
│   ├── styles.ts
│   ├── theme.ts
│   └── utils.ts
├── setupTests.ts
└── Select.test.tsx
```

---

**`jest.config.js` (Example Configuration)**

Ensure your `jest.config.js` (or `package.json`'s `jest` field) is set up to use `ts-jest` and map modules to your mocks.

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    // Map internal imports to their mock versions
    '^./components/Menu$': '<rootDir>/src/__mocks__/react-select/components/Menu.tsx',
    '^./components/LiveRegion$': '<rootDir>/src/__mocks__/react-select/components/LiveRegion.tsx',
    '^./filters$': '<rootDir>/src/__mocks__/react-select/filters.ts',
    '^./internal/index$': '<rootDir>/src/__mocks__/react-select/internal/index.tsx',
    '^./accessibility/index$': '<rootDir>/src/__mocks__/react-select/accessibility/index.ts',
    '^./accessibility/helpers$': '<rootDir>/src/__mocks__/react-select/accessibility/helpers.ts',
    '^./utils$': '<rootDir>/src/__mocks__/react-select/utils.ts',
    '^./builtins$': '<rootDir>/src/__mocks__/react-select/builtins.ts',
    '^./components/index$': '<rootDir>/src/__mocks__/react-select/components/index.ts',
    '^./styles$': '<rootDir>/src/__mocks__/react-select/styles.ts',
    '^./theme$': '<rootDir>/src/__mocks__/react-select/theme.ts',
    // For CSS imports if you have them
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  // Collect coverage from your source files
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/__mocks__/**',
  ],
  coverageDirectory: 'coverage',
};
```

---

**`src/setupTests.ts`**

This file runs before each test file and is used for global test setup.

```typescript
// src/setupTests.ts
import '@testing-library/jest-dom';

// Mock window.matchMedia if any component uses it (common in UI libraries)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock HTMLElement.prototype.scrollIntoView as it's a DOM method
window.HTMLElement.prototype.scrollIntoView = jest.fn();

// Mock document.activeElement for focus tests.
// This allows us to control what `document.activeElement` returns during tests.
let mockActiveElement: Element | null = document.body;
Object.defineProperty(document, 'activeElement', {
  get: jest.fn(() => mockActiveElement),
  configurable: true, // Allow re-defining in specific tests if needed
});

// Helper to set the active element for tests
export const setActiveElement = (element: Element | null) => {
  mockActiveElement = element;
};

// Mock global instanceId counter to ensure predictable IDs for testing
let mockInstanceId = 0;
jest.mock('./index', () => {
  const originalModule = jest.requireActual('./index');
  return {
    ...originalModule,
    // Override the default export (the Select class)
    default: class Select extends originalModule.default {
      constructor(props: any) {
        super(props);
        // Ensure instancePrefix is predictable for testing
        this.state.instancePrefix = 'react-select-test-' + (++mockInstanceId);
      }
    },
  };
});

// Reset mockInstanceId and activeElement before each test
beforeEach(() => {
  mockInstanceId = 0;
  setActiveElement(document.body); // Reset active element to body
});
```

---

**Mock Files (`src/__mocks__/react-select/...`)**

These files provide mock implementations for the modules imported by `Select`.

**`src/__mocks__/react-select/utils.ts`**
```typescript
export const classNames = jest.fn((prefix, ...args) => {
  const classes = args.filter(Boolean).join(' ');
  return prefix ? `${prefix}-${classes}` : classes;
});
export const cleanValue = jest.fn((value) => {
  if (value === null || value === undefined) return [];
  if (Array.isArray(value)) return value;
  return [value];
});
export const isTouchCapable = jest.fn(() => false);
export const isMobileDevice = jest.fn(() => false);
export const noop = jest.fn();
export const scrollIntoView = jest.fn();
export const isDocumentElement = jest.fn((element) => element === document.documentElement || element === document.body);
export const notNullish = jest.fn((x) => x != null);
export const valueTernary = jest.fn((condition, truthy, falsy) => condition ? truthy : falsy);
export const multiValueAsValue = jest.fn((value) => value);
export const singleValueAsValue = jest.fn((value) => value);
```

**`src/__mocks__/react-select/filters.ts`**
```typescript
export const createFilter = jest.fn(() => (option, inputValue) => {
  if (!inputValue) return true;
  const { label, value } = option;
  return (
    label.toLowerCase().includes(inputValue.toLowerCase()) ||
    value.toLowerCase().includes(inputValue.toLowerCase())
  );
});
```

**`src/__mocks__/react-select/accessibility/helpers.ts`**
```typescript
export const isAppleDevice = jest.fn(() => false);
```

**`src/__mocks__/react-select/accessibility/index.ts`**
```typescript
// These are types, not actual components/functions to mock their behavior
// They are included to satisfy TypeScript imports.
export const AriaLiveMessages = {};
export const AriaSelection = {};
```

**`src/__mocks__/react-select/components/Menu.tsx`**
```typescript
import * as React from 'react';

export const MenuPlacer = jest.fn(({ children, ...props }) => {
  const ref = React.useRef(null);
  // Simulate placerProps for basic rendering
  const placerProps = {
    placement: props.menuPlacement || 'bottom',
    maxHeight: props.maxMenuHeight || 300,
  };
  return (
    <div data-testid="MenuPlacer" {...props} ref={ref}>
      {children({ ref, placerProps })}
    </div>
  );
});
```

**`src/__mocks__/react-select/components/LiveRegion.tsx`**
```typescript
import * as React from 'react';

const LiveRegion = jest.fn((props) => {
  // Simplified mock for LiveRegion to check props and render basic content
  return (
    <div
      data-testid="LiveRegion"
      id={props.id}
      aria-live={props['aria-live'] || 'polite'}
      aria-atomic="true"
      style={{
        border: '0px',
        clip: 'rect(1px, 1px, 1px, 1px)',
        height: '1px',
        width: '1px',
        overflow: 'hidden',
        padding: '0px',
        position: 'absolute',
        whiteSpace: 'nowrap',
        wordWrap: 'normal',
      }}
    >
      {/* Render some content based on props for testing */}
      {props.ariaSelection && (
        <span>
          {props.ariaSelection.action}:{' '}
          {Array.isArray(props.ariaSelection.value)
            ? props.ariaSelection.value.map((v: any) => v.label).join(', ')
            : props.ariaSelection.value?.label}
        </span>
      )}
      {props.focusedOption && (
        <span>Focused: {props.focusedOption.label}</span>
      )}
    </div>
  );
});

export default LiveRegion;
```

**`src/__mocks__/react-select/internal/index.tsx`**
```typescript
import * as React from 'react';

export const DummyInput = jest.fn((props) => (
  <input data-testid="DummyInput" {...props} ref={props.innerRef} />
));

export const ScrollManager = jest.fn(({ children, ...props }) => {
  const ref = React.useRef(null);
  return (
    <div data-testid="ScrollManager" {...props} data-capture-enabled={props.captureEnabled} data-lock-enabled={props.lockEnabled}>
      {children((instance: HTMLDivElement | null) => {
        if (instance) ref.current = instance;
      })}
    </div>
  );
});

export const RequiredInput = jest.fn((props) => (
  <input data-testid="RequiredInput" type="hidden" {...props} />
));
```

**`src/__mocks__/react-select/builtins.ts`**
```typescript
export const formatGroupLabelBuiltin = jest.fn((group) => group.label);
export const getOptionLabelBuiltin = jest.fn((option) => option.label);
export const getOptionValueBuiltin = jest.fn((option) => option.value);
export const isOptionDisabledBuiltin = jest.fn(() => false);
```

**`src/__mocks__/react-select/components/index.ts`**
```typescript
import * as React from 'react';

// Helper to create a generic mock component that renders a div
const createMockComponent = (name: string) => jest.fn((props) => {
  const { children, innerProps, innerRef, ...rest } = props;
  return React.createElement(
    'div',
    {
      'data-testid': name,
      'data-component-name': name,
      ref: innerRef,
      ...innerProps,
      ...rest,
    },
    children
  );
});

// Specific mock for Input to be an actual input element
const MockInput = jest.fn((props) => {
  const { children, innerProps, innerRef, ...rest } = props;
  return (
    <input
      data-testid="Input"
      data-component-name="Input"
      ref={innerRef}
      {...innerProps}
      {...rest}
    />
  );
});

// Specific mock for Option to have role="option" and data-is-focused/data-is-disabled attributes
const MockOption = jest.fn((props) => {
  const { children, innerProps, innerRef, isFocused, isDisabled, isSelected, ...rest } = props;
  return (
    <div
      data-testid="Option"
      data-component-name="Option"
      role="option"
      ref={innerRef}
      {...innerProps}
      data-is-focused={isFocused}
      data-is-disabled={isDisabled}
      data-is-selected={isSelected}
      {...rest}
    >
      {children}
    </div>
  );
});

// Specific mock for MenuPortal to just render its children in the test DOM
const MockMenuPortal = jest.fn(({ children, appendTo, controlElement, ...props }) => {
  return (
    <div data-testid="MenuPortal" data-component-name="MenuPortal" data-append-to={!!appendTo} {...props}>
      {children}
    </div>
  );
});


export const defaultComponents = jest.fn(() => ({
  ClearIndicator: createMockComponent('ClearIndicator'),
  Control: createMockComponent('Control'),
  DropdownIndicator: createMockComponent('DropdownIndicator'),
  Group: createMockComponent('Group'),
  GroupHeading: createMockComponent('GroupHeading'),
  IndicatorsContainer: createMockComponent('IndicatorsContainer'),
  Input: MockInput,
  IndicatorSeparator: createMockComponent('IndicatorSeparator'),
  LoadingIndicator: createMockComponent('LoadingIndicator'),
  LoadingMessage: createMockComponent('LoadingMessage'),
  Menu: createMockComponent('Menu'),
  MenuList: createMockComponent('MenuList'),
  MenuPortal: MockMenuPortal,
  MultiValue: createMockComponent('MultiValue'),
  MultiValueContainer: createMockComponent('MultiValueContainer'),
  MultiValueLabel: createMockComponent('MultiValueLabel'),
  MultiValueRemove: createMockComponent('MultiValueRemove'),
  NoOptionsMessage: createMockComponent('NoOptionsMessage'),
  Option: MockOption,
  Placeholder: createMockComponent('Placeholder'),
  SelectContainer: createMockComponent('SelectContainer'),
  SingleValue: createMockComponent('SingleValue'),
  ValueContainer: createMockComponent('ValueContainer'),
}));

export const SelectComponentsConfig = {}; // Export type for TS
```

**`src/__mocks__/react-select/styles.ts`**
```typescript
export const defaultStyles = {
  clearIndicator: jest.fn(() => ({})),
  control: jest.fn(() => ({})),
  dropdownIndicator: jest.fn(() => ({})),
  group: jest.fn(() => ({})),
  groupHeading: jest.fn(() => ({})),
  indicatorsContainer: jest.fn(() => ({})),
  input: jest.fn(() => ({})),
  indicatorSeparator: jest.fn(() => ({})),
  loadingIndicator: jest.fn(() => ({})),
  loadingMessage: jest.fn(() => ({})),
  menu: jest.fn(() => ({})),
  menuList: jest.fn(() => ({})),
  menuPortal: jest.fn(() => ({})),
  multiValue: jest.fn(() => ({})),
  multiValueContainer: jest.fn(() => ({})),
  multiValueLabel: jest.fn(() => ({})),
  multiValueRemove: jest.fn(() => ({})),
  noOptionsMessage: jest.fn(() => ({})),
  option: jest.fn(() => ({})),
  placeholder: jest.fn(() => ({})),
  selectContainer: jest.fn(() => ({})),
  singleValue: jest.fn(() => ({})),
  valueContainer: jest.fn(() => ({})),
};

export const StylesConfig = {}; // Export type for TS
export const StylesProps = {}; // Export type for TS
```

**`src/__mocks__/react-select/theme.ts`**
```typescript
export const defaultTheme = {
  borderRadius: 4,
  colors: {
    primary: '#2684FF',
    primary75: '#4C9AFF',
    primary50: '#B2D4FF',
    primary25: '#DEEBFF',
    danger: '#DE350B',
    dangerLight: '#FFBDAD',
    neutral0: 'hsl(0, 0%, 100%)',
    neutral5: 'hsl(0, 0%, 95%)',
    neutral10: 'hsl(0, 0%, 90%)',
    neutral20: 'hsl(0, 0%, 80%)',
    neutral30: 'hsl(0, 0%, 70%)',
    neutral40: 'hsl(0, 0%, 60%)',
    neutral50: 'hsl(0, 0%, 50%)',
    neutral60: 'hsl(0, 0%, 40%)',
    neutral70: 'hsl(0, 0%, 30%)',
    neutral80: 'hsl(0, 0%, 20%)',
    neutral90: 'hsl(0, 0%, 10%)',
  },
  spacing: {
    baseUnit: 4,
    controlHeight: 38,
    menuGutter: 8,
  },
};

export const ThemeConfig = {}; // Export type for TS
```

---

**`src/Select.test.tsx`**

```tsx
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Select from './index'; // The component under test
import { setActiveElement } from './setupTests'; // Import helper to control activeElement

// Import mocks to ensure they are used and to cast them to Jest mock functions
import {
  isTouchCapable,
  isMobileDevice,
  scrollIntoView,
  cleanValue,
  classNames,
  valueTernary,
  multiValueAsValue,
  singleValueAsValue,
  isDocumentElement,
} from './utils';
import { createFilter } from './filters';
import { DummyInput, ScrollManager, RequiredInput } from './internal';
import { isAppleDevice } from './accessibility/helpers';
import { defaultComponents } from './components';
import { defaultStyles } from './styles';
import { defaultTheme } from './theme';
import {
  formatGroupLabelBuiltin,
  getOptionLabelBuiltin,
  getOptionValueBuiltin,
  isOptionDisabledBuiltin,
} from './builtins';

// Cast mocks to Jest mock functions for easier assertion
const mockIsTouchCapable = isTouchCapable as jest.Mock;
const mockIsMobileDevice = isMobileDevice as jest.Mock;
const mockScrollIntoView = scrollIntoView as jest.Mock;
const mockCleanValue = cleanValue as jest.Mock;
const mockClassNames = classNames as jest.Mock;
const mockValueTernary = valueTernary as jest.Mock;
const mockMultiValueAsValue = multiValueAsValue as jest.Mock;
const mockSingleValueAsValue = singleValueAsValue as jest.Mock;
const mockIsDocumentElement = isDocumentElement as jest.Mock;
const mockCreateFilter = createFilter as jest.Mock;
const mockDummyInput = DummyInput as jest.Mock;
const mockScrollManager = ScrollManager as jest.Mock;
const mockRequiredInput = RequiredInput as jest.Mock;
const mockIsAppleDevice = isAppleDevice as jest.Mock;
const mockDefaultComponents = defaultComponents as jest.Mock;
const mockDefaultStyles = defaultStyles as jest.Mocked<typeof defaultStyles>;
const mockDefaultTheme = defaultTheme as jest.Mocked<typeof defaultTheme>;
const mockFormatGroupLabelBuiltin = formatGroupLabelBuiltin as jest.Mock;
const mockGetOptionLabelBuiltin = getOptionLabelBuiltin as jest.Mock;
const mockGetOptionValueBuiltin = getOptionValueBuiltin as jest.Mock;
const mockIsOptionDisabledBuiltin = isOptionDisabledBuiltin as jest.Mock;

// Helper to get the input element (either real Input or DummyInput)
const getSelectInput = () => screen.getByRole('combobox');

// Helper to get the control element
const getSelectControl = () => screen.getByTestId('Control');

// Helper to get the menu list
const getMenuList = () => screen.queryByTestId('MenuList');

// Helper to get all options in the menu
const getAllOptions = () => screen.queryAllByTestId('Option');

// Helper to get a specific option by label
const getOptionByLabel = (label: string) => screen.queryByRole('option', { name: label });

// Common options for tests
const options = [
  { value: 'ocean', label: 'Ocean' },
  { value: 'blue', label: 'Blue' },
  { value: 'red', label: 'Red' },
  { value: 'green', label: 'Green', isDisabled: true }, // Disabled option
  { value: 'yellow', label: 'Yellow' },
];

const groupedOptions = [
  {
    label: 'Colors',
    options: [
      { value: 'red', label: 'Red' },
      { value: 'green', label: 'Green', isDisabled: true },
    ],
  },
  {
    label: 'Animals',
    options: [
      { value: 'cat', label: 'Cat' },
      { value: 'dog', label: 'Dog' },
    ],
  },
];

describe('Select Component', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsTouchCapable.mockReturnValue(false);
    mockIsMobileDevice.mockReturnValue(false);
    mockIsAppleDevice.mockReturnValue(false);
    mockCleanValue.mockImplementation((value) => {
      if (value === null || value === undefined) return [];
      if (Array.isArray(value)) return value;
      return [value];
    });
    mockValueTernary.mockImplementation((condition, truthy, falsy) => condition ? truthy : falsy);
    mockMultiValueAsValue.mockImplementation((value) => value);
    mockSingleValueAsValue.mockImplementation((value) => value);
    mockIsDocumentElement.mockImplementation((element) => element === document.documentElement || element === document.body);
    mockCreateFilter.mockReturnValue((option: any, inputValue: string) => {
      if (!inputValue) return true;
      const { label, value } = option;
      return (
        label.toLowerCase().includes(inputValue.toLowerCase()) ||
        value.toLowerCase().includes(inputValue.toLowerCase())
      );
    });
    // Ensure default built-in functions are used
    mockFormatGroupLabelBuiltin.mockImplementation((group) => group.label);
    mockGetOptionLabelBuiltin.mockImplementation((option) => option.label);
    mockGetOptionValueBuiltin.mockImplementation((option) => option.value);
    mockIsOptionDisabledBuiltin.mockImplementation(() => false);

    // Reset active element to body for most tests
    setActiveElement(document.body);
  });

  // --- 2. Component Rendering Tests ---
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<Select options={options} />);
      expect(screen.getByTestId('SelectContainer')).toBeInTheDocument();
      expect(screen.getByTestId('Control')).toBeInTheDocument();
      expect(screen.getByTestId('ValueContainer')).toBeInTheDocument();
      expect(getSelectInput()).toBeInTheDocument();
      expect(screen.getByTestId('IndicatorsContainer')).toBeInTheDocument();
      expect(screen.getByTestId('DropdownIndicator')).toBeInTheDocument();
      expect(screen.getByTestId('Placeholder')).toHaveTextContent('Select...');
      expect(screen.getByTestId('LiveRegion')).toBeInTheDocument();
    });

    it('applies className and classNamePrefix', () => {
      render(<Select options={options} className="my-select" classNamePrefix="rs" />);
      expect(screen.getByTestId('SelectContainer')).toHaveClass('my-select');
      // Verify that classNames utility was called with the prefix
      expect(mockClassNames).toHaveBeenCalledWith('rs', expect.any(String), expect.any(Object));
    });

    it('renders SingleValue when value is provided and not multi-select', () => {
      render(<Select options={options} value={options[0]} />);
      expect(screen.getByTestId('SingleValue')).toHaveTextContent('Ocean');
      expect(screen.queryByTestId('Placeholder')).not.toBeInTheDocument();
    });

    it('renders MultiValue when value is provided and isMulti', () => {
      render(<Select options={options} value={[options[0], options[1]]} isMulti />);
      expect(screen.getAllByTestId('MultiValue')).toHaveLength(2);
      expect(screen.getAllByTestId('MultiValue')[0]).toHaveTextContent('Ocean');
      expect(screen.getAllByTestId('MultiValue')[1]).toHaveTextContent('Blue');
    });

    it('renders DummyInput when isSearchable is false', () => {
      render(<Select options={options} isSearchable={false} />);
      expect(screen.getByTestId('DummyInput')).toBeInTheDocument();
      expect(screen.queryByTestId('Input')).not.toBeInTheDocument();
    });

    it('renders ClearIndicator when isClearable and has value', () => {
      render(<Select options={options} value={options[0]} isClearable />);
      expect(screen.getByTestId('ClearIndicator')).toBeInTheDocument();
    });

    it('does not render ClearIndicator when not clearable', () => {
      render(<Select options={options} value={options[0]} isClearable={false} />);
      expect(screen.queryByTestId('ClearIndicator')).not.toBeInTheDocument();
    });

    it('renders LoadingIndicator when isLoading is true', () => {
      render(<Select options={options} isLoading />);
      expect(screen.getByTestId('LoadingIndicator')).toBeInTheDocument();
    });

    it('renders RequiredInput when required and no value', () => {
      render(<Select options={options} required name="test" />);
      expect(screen.getByTestId('RequiredInput')).toBeInTheDocument();
      expect(screen.getByTestId('RequiredInput')).toHaveAttribute('name', 'test');
    });

    it('applies accessibility attributes to the input', () => {
      render(
        <Select
          options={options}
          aria-label="My Select"
          aria-labelledby="label-id"
          aria-invalid
          aria-errormessage="error-message-id"
          required
          menuIsOpen
        />
      );
      const input = getSelectInput();
      expect(input).toHaveAttribute('aria-label', 'My Select');
      expect(input).toHaveAttribute('aria-labelledby', 'label-id');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('aria-errormessage', 'error-message-id');
      expect(input).toHaveAttribute('aria-required', 'true');
      expect(input).toHaveAttribute('aria-autocomplete', 'list');
      expect(input).toHaveAttribute('aria-expanded', 'true');
      expect(input).toHaveAttribute('aria-haspopup', 'true');
      expect(input).toHaveAttribute('role', 'combobox');
      expect(input).toHaveAttribute('aria-controls', 'react-select-test-1-listbox');
    });

    it('renders hidden input for form submission (single value)', () => {
      render(<Select options={options} name="myField" value={options[0]} />);
      const hiddenInput = screen.getByRole('textbox', { hidden: true }); // hidden input is type="hidden"
      expect(hiddenInput).toHaveAttribute('name', 'myField');
      expect(hiddenInput).toHaveAttribute('value', 'ocean');
    });

    it('renders multiple hidden inputs for multi-select with no delimiter', () => {
      render(<Select options={options} name="myField" value={[options[0], options[1]]} isMulti />);
      const hiddenInputs = screen.getAllByRole('textbox', { hidden: true });
      expect(hiddenInputs).toHaveLength(2);
      expect(hiddenInputs[0]).toHaveAttribute('name', 'myField');
      expect(hiddenInputs[0]).toHaveAttribute('value', 'ocean');
      expect(hiddenInputs[1]).toHaveAttribute('name', 'myField');
      expect(hiddenInputs[1]).toHaveAttribute('value', 'blue');
    });

    it('renders single hidden input with delimiter for multi-select', () => {
      render(<Select options={options} name="myField" value={[options[0], options[1]]} isMulti delimiter="," />);
      const hiddenInput = screen.getByRole('textbox', { hidden: true });
      expect(hiddenInput).toHaveAttribute('name', 'myField');
      expect(hiddenInput).toHaveAttribute('value', 'ocean,blue');
    });
  });

  // --- 3. User Interaction Testing ---
  describe('User Interactions', () => {
    describe('Keyboard Navigation', () => {
      it('opens menu and focuses first option on ArrowDown', async () => {
        render(<Select options={options} />);
        const input = getSelectInput();
        userEvent.tab(); // Focus the input
        expect(input).toHaveFocus();

        fireEvent.keyDown(input, { key: 'ArrowDown', code: 'ArrowDown' });
        expect(getMenuList()).toBeInTheDocument();
        expect(getOptionByLabel('Ocean')).toHaveAttribute('data-is-focused', 'true');
        expect(mockScrollIntoView).toHaveBeenCalled();
      });

      it('opens menu and focuses last option on ArrowUp', async () => {
        render(<Select options={options} />);
        const input = getSelectInput();
        userEvent.tab();
        fireEvent.keyDown(input, { key: 'ArrowUp', code: 'ArrowUp' });
        expect(getMenuList()).toBeInTheDocument();
        expect(getOptionByLabel('Yellow')).toHaveAttribute('data-is-focused', 'true');
      });

      it('selects focused option on Enter', async () => {
        const handleChange = jest.fn();
        render(<Select options={options} onChange={handleChange} />);
        const input = getSelectInput();
        userEvent.tab();
        fireEvent.keyDown(input, { key: 'ArrowDown', code: 'ArrowDown' }); // Focus Ocean
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

        expect(handleChange).toHaveBeenCalledWith(options[0], { action: 'select-option', option: options[0], name: undefined });
        expect(getMenuList()).not.toBeInTheDocument(); // Menu closes on select by default
        expect(screen.getByTestId('SingleValue')).toHaveTextContent('Ocean');
      });

      it('closes menu on Escape', async () => {
        const handleMenuClose = jest.fn();
        render(<Select options={options} menuIsOpen onMenuClose={handleMenuClose} />);
        const input = getSelectInput();
        expect(getMenuList()).toBeInTheDocument();

        fireEvent.keyDown(input, { key: 'Escape', code: 'Escape' });
        expect(handleMenuClose).toHaveBeenCalled();
        expect(getMenuList()).not.toBeInTheDocument();
      });

      it('clears value on Escape if escapeClearsValue and isClearable', async () => {
        const handleChange = jest.fn();
        render(<Select options={options} value={options[0]} isClearable escapeClearsValue onChange={handleChange} />);
        const input = getSelectInput();
        userEvent.tab(); // Focus input
        fireEvent.keyDown(input, { key: 'Escape', code: 'Escape' });
        expect(handleChange).toHaveBeenCalledWith(null, { action: 'clear', removedValues: [options[0]], name: undefined });
        expect(screen.queryByTestId('SingleValue')).not.toBeInTheDocument();
        expect(screen.getByTestId('Placeholder')).toBeInTheDocument();
      });

      it('selects focused option on Tab if tabSelectsValue is true', async () => {
        const handleChange = jest.fn();
        render(<Select options={options} onChange={handleChange} />);
        const input = getSelectInput();
        userEvent.tab();
        fireEvent.keyDown(input, { key: 'ArrowDown', code: 'ArrowDown' }); // Focus Ocean
        fireEvent.keyDown(input, { key: 'Tab', code: 'Tab' });

        expect(handleChange).toHaveBeenCalledWith(options[0], { action: 'select-option', option: options[0], name: undefined });
      });

      it('does not select focused option on Tab if tabSelectsValue is false', async () => {
        const handleChange = jest.fn();
        render(<Select options={options} onChange={handleChange} tabSelectsValue={false} />);
        const input = getSelectInput();
        userEvent.tab();
        fireEvent.keyDown(input, { key: 'ArrowDown', code: 'ArrowDown' }); // Focus Ocean
        fireEvent.keyDown(input, { key: 'Tab', code: 'Tab' });

        expect(handleChange).not.toHaveBeenCalled();
      });

      it('removes focused value on Backspace/Delete in multi-select', async () => {
        const handleChange = jest.fn();
        render(<Select options={options} value={[options[0], options[1]]} isMulti onChange={handleChange} />);
        const input = getSelectInput();
        userEvent.tab();
        fireEvent.keyDown(input, { key: 'ArrowLeft', code: 'ArrowLeft' }); // Focus last value (Blue)
        expect(screen.getByTestId('MultiValue', { name: 'Blue' })).toHaveAttribute('data-is-focused', 'true');

        fireEvent.keyDown(input, { key: 'Backspace', code: 'Backspace' });
        expect(handleChange).toHaveBeenCalledWith([options[0]], { action: 'remove-value', removedValue: options[1], name: undefined });
      });

      it('pops last value on Backspace/Delete if no focused value in multi-select', async () => {
        const handleChange = jest.fn();
        render(<Select options={options} value={[options[0], options[1]]} isMulti onChange={handleChange} />);
        const input = getSelectInput();
        userEvent.tab();
        fireEvent.keyDown(input, { key: 'Backspace', code: 'Backspace' }); // No focused value, pop last
        expect(handleChange).toHaveBeenCalledWith([options[0]], { action: 'pop-value', removedValue: options[1], name: undefined });
      });

      it('clears value on Backspace/Delete in single-select if isClearable', async () => {
        const handleChange = jest.fn();
        render(<Select options={options} value={options[0]} isClearable onChange={handleChange} />);
        const input = getSelectInput();
        userEvent.tab();
        fireEvent.keyDown(input, { key: 'Backspace', code: 'Backspace' });
        expect(handleChange).toHaveBeenCalledWith(null, { action: 'clear', removedValues: [options[0]], name: undefined });
      });

      it('navigates focused value with ArrowLeft/ArrowRight in multi-select', async () => {
        render(<Select options={options} value={[options[0], options[1], options[2]]} isMulti />);
        const input = getSelectInput();
        userEvent.tab();
        fireEvent.keyDown(input, { key: 'ArrowLeft', code: 'ArrowLeft' }); // Focus Red
        expect(screen.getByTestId('MultiValue', { name: 'Red' })).toHaveAttribute('data-is-focused', 'true');
        fireEvent.keyDown(input, { key: 'ArrowLeft', code: 'ArrowLeft' }); // Focus Blue
        expect(screen.getByTestId('MultiValue', { name: 'Blue' })).toHaveAttribute('data-is-focused', 'true');
        fireEvent.keyDown(input, { key: 'ArrowRight', code: 'ArrowRight' }); // Focus Red
        expect(screen.getByTestId('MultiValue', { name: 'Red' })).toHaveAttribute('data-is-focused', 'true');
      });

      it('navigates options with PageUp/PageDown', async () => {
        render(<Select options={options} menuIsOpen pageSize={2} />);
        const input = getSelectInput();
        userEvent.tab();
        fireEvent.keyDown(input, { key: 'ArrowDown', code: 'ArrowDown' }); // Focus Ocean
        expect(getOptionByLabel('Ocean')).toHaveAttribute('data-is-focused', 'true');

        fireEvent.keyDown(input, { key: 'PageDown', code: 'PageDown' }); // Jump 2 down
        expect(getOptionByLabel('Red')).toHaveAttribute('data-is-focused', 'true');

        fireEvent.keyDown(input, { key: 'PageUp', code: 'PageUp' }); // Jump 2 up
        expect(getOptionByLabel('Ocean')).toHaveAttribute('data-is-focused', 'true');
      });

      it('navigates options with Home/End', async () => {
        render(<Select options={options} menuIsOpen />);
        const input = getSelectInput();
        userEvent.tab();
        fireEvent.keyDown(input, { key: 'ArrowDown', code: 'ArrowDown' }); // Focus Ocean
        fireEvent.keyDown(input, { key: 'ArrowDown', code: 'ArrowDown' }); // Focus Blue
        expect(getOptionByLabel('Blue')).toHaveAttribute('data-is-focused', 'true');

        fireEvent.keyDown(input, { key: 'End', code: 'End' });
        expect(getOptionByLabel('Yellow')).toHaveAttribute('data-is-focused', 'true');

        fireEvent.keyDown(input, { key: 'Home', code: 'Home' });
        expect(getOptionByLabel('Ocean')).toHaveAttribute('data-is-focused', 'true');
      });
    });

    describe('Mouse Interactions', () => {
      it('opens menu on control click if openMenuOnClick is true', async () => {
        render(<Select options={options} openMenuOnClick />);
        const control = getSelectControl();
        fireEvent.mouseDown(control);
        expect(getMenuList()).toBeInTheDocument();
      });

      it('does not open menu on control click if openMenuOnClick is false', async () => {
        render(<Select options={options} openMenuOnClick={false} />);
        const control = getSelectControl();
        fireEvent.mouseDown(control);
        expect(getMenuList()).not.toBeInTheDocument();
      });

      it('closes menu on control click if menu is open and target is not input/textarea', async () => {
        render(<Select options={options} menuIsOpen />);
        const control = getSelectControl();
        expect(getMenuList()).toBeInTheDocument();
        fireEvent.mouseDown(control);
        expect(getMenuList()).not.toBeInTheDocument();
      });

      it('opens/closes menu on dropdown indicator click', async () => {
        render(<Select options={options} />);
        const dropdownIndicator = screen.getByTestId('DropdownIndicator');
        fireEvent.mouseDown(dropdownIndicator);
        expect(getMenuList()).toBeInTheDocument();
        fireEvent.mouseDown(dropdownIndicator);
        expect(getMenuList()).not.toBeInTheDocument();
      });

      it('clears value on clear indicator click', async () => {
        const handleChange = jest.fn();
        render(<Select options={options} value={options[0]} isClearable onChange={handleChange} />);
        const clearIndicator = screen.getByTestId('ClearIndicator');
        fireEvent.mouseDown(clearIndicator);
        expect(handleChange).toHaveBeenCalledWith(null, { action: 'clear', removedValues: [options[0]], name: undefined });
        expect(screen.queryByTestId('SingleValue')).not.toBeInTheDocument();
      });

      it('selects option on click', async () => {
        const handleChange = jest.fn();
        render(<Select options={options} onChange={handleChange} menuIsOpen />);
        const option = getOptionByLabel('Ocean');
        fireEvent.click(option!);
        expect(handleChange).toHaveBeenCalledWith(options[0], { action: 'select-option', option: options[0], name: undefined });
        expect(getMenuList()).not.toBeInTheDocument(); // Menu closes on select by default
      });

      it('deselects option on click in multi-select', async () => {
        const handleChange = jest.fn();
        render(<Select options={options} value={[options[0], options[1]]} isMulti onChange={handleChange} menuIsOpen />);
        const option = getOptionByLabel('Ocean');
        fireEvent.click(option!);
        expect(handleChange).toHaveBeenCalledWith([options[1]], { action: 'deselect-option', option: options[0], name: undefined });
        expect(screen.queryByTestId('MultiValue', { name: 'Ocean' })).not.toBeInTheDocument();
      });

      it('does not select disabled option on click', async () => {
        const handleChange = jest.fn();
        render(<Select options={options} onChange={handleChange} menuIsOpen />);
        const disabledOption = getOptionByLabel('Green');
        expect(disabledOption).toHaveAttribute('data-is-disabled', 'true');
        fireEvent.click(disabledOption!);
        expect(handleChange).not.toHaveBeenCalled();
      });

      it('focuses option on mouse hover', async () => {
        render(<Select options={options} menuIsOpen />);
        const option = getOptionByLabel('Blue');
        fireEvent.mouseOver(option!);
        expect(option).toHaveAttribute('data-is-focused', 'true');
      });
    });

    describe('Touch Interactions', () => {
      it('handles touch events for control', async () => {
        render(<Select options={options} />);
        const control = getSelectControl();
        fireEvent.touchStart(control);
        fireEvent.touchEnd(control);
        expect(getMenuList()).toBeInTheDocument(); // Should open menu
      });

      it('handles touch events for clear indicator', async () => {
        const handleChange = jest.fn();
        render(<Select options={options} value={options[0]} isClearable onChange={handleChange} />);
        const clearIndicator = screen.getByTestId('ClearIndicator');
        fireEvent.touchStart(clearIndicator);
        fireEvent.touchEnd(clearIndicator);
        expect(handleChange).toHaveBeenCalledWith(null, { action: 'clear', removedValues: [options[0]], name: undefined });
      });

      it('handles touch events for dropdown indicator', async () => {
        render(<Select options={options} />);
        const dropdownIndicator = screen.getByTestId('DropdownIndicator');
        fireEvent.touchStart(dropdownIndicator);
        fireEvent.touchEnd(dropdownIndicator);
        expect(getMenuList()).toBeInTheDocument();
      });

      it('closes menu on outside touch end if user is not dragging', async () => {
        render(<Select options={options} menuIsOpen />);
        expect(getMenuList()).toBeInTheDocument();

        // Simulate touch outside the control and menu
        fireEvent.touchStart(document.body);
        fireEvent.touchEnd(document.body);

        expect(getMenuList()).not.toBeInTheDocument();
      });

      it('does not close menu on outside touch end if user is dragging', async () => {
        render(<Select options={options} menuIsOpen />);
        expect(getMenuList()).toBeInTheDocument();

        // Simulate dragging
        fireEvent.touchStart(document.body, { touches: [{ clientX: 0, clientY: 0 }] });
        fireEvent.touchMove(document.body, { touches: [{ clientX: 100, clientY: 100 }] });
        fireEvent.touchEnd(document.body);

        expect(getMenuList()).toBeInTheDocument(); // Menu should remain open
      });
    });
  });

  // --- 4. State Management Tests ---
  describe('State Management', () => {
    it('updates selectValue from props.value in getDerivedStateFromProps', () => {
      const { rerender } = render(<Select options={options} value={options[0]} />);
      expect(screen.getByTestId('SingleValue')).toHaveTextContent('Ocean');

      rerender(<Select options={options} value={options[1]} />);
      expect(screen.getByTestId('SingleValue')).toHaveTextContent('Blue');
    });

    it('manages focusedOption based on menuIsOpen and value changes', () => {
      const { rerender } = render(<Select options={options} />);
      const input = getSelectInput();

      // Open menu, focus first option
      userEvent.tab();
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      expect(getOptionByLabel('Ocean')).toHaveAttribute('data-is-focused', 'true');

      // Change value, focused option should remain if still in options
      rerender(<Select options={options} value={options[0]} menuIsOpen />);
      expect(getOptionByLabel('Ocean')).toHaveAttribute('data-is-focused', 'true');

      // Change options, focused option should update
      const newOptions = [{ value: 'new', label: 'New' }, ...options];
      rerender(<Select options={newOptions} menuIsOpen />);
      expect(getOptionByLabel('New')).toHaveAttribute('data-is-focused', 'true');
      expect(getOptionByLabel('Ocean')).not.toHaveAttribute('data-is-focused', 'true');
    });

    it('manages focusedValue in multi-select', async () => {
      render(<Select options={options} value={[options[0], options[1]]} isMulti />);
      const input = getSelectInput();
      userEvent.tab();

      fireEvent.keyDown(input, { key: 'ArrowLeft' }); // Focus Blue
      expect(screen.getByTestId('MultiValue', { name: 'Blue' })).toHaveAttribute('data-is-focused', 'true');

      fireEvent.keyDown(input, { key: 'Backspace' }); // Remove Blue
      expect(screen.queryByTestId('MultiValue', { name: 'Blue' })).not.toBeInTheDocument();
      expect(screen.getByTestId('MultiValue', { name: 'Ocean' })).toHaveAttribute('data-is-focused', 'true'); // Focused value should shift to Ocean
    });

    it('updates inputIsHidden state correctly', async () => {
      render(<Select options={options} />);
      const input = getSelectInput();

      // Initially not hidden
      expect(input).not.toHaveAttribute('data-is-hidden', 'true');

      // Select an option in single select, input should be hidden
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(input).toHaveAttribute('data-is-hidden', 'true');

      // Type something, input should become visible
      fireEvent.change(input, { target: { value: 'o' } });
      expect(input).not.toHaveAttribute('data-is-hidden', 'true');
    });

    it('manages isFocused state on focus/blur', async () => {
      const handleFocus = jest.fn();
      const handleBlur = jest.fn();
      render(<Select options={options} onFocus={handleFocus} onBlur={handleBlur} />);
      const input = getSelectInput();
      const control = getSelectControl();

      fireEvent.focus(input);
      expect(handleFocus).toHaveBeenCalled();
      expect(control).toHaveAttribute('data-is-focused', 'true');

      fireEvent.blur(input);
      expect(handleBlur).toHaveBeenCalled();
      expect(control).toHaveAttribute('data-is-focused', 'false');
    });

    it('restores focus to input if menuListRef contains activeElement on blur', async () => {
      render(<Select options={options} menuIsOpen />);
      const input = getSelectInput();
      const menuList = getMenuList();

      // Simulate activeElement being inside menuList
      setActiveElement(menuList);

      fireEvent.blur(input);
      // Input should regain focus immediately
      expect(input).toHaveFocus();
    });

    it('blurs select state if programmatically disabled while focused', () => {
      const { rerender } = render(<Select options={options} />);
      const input = getSelectInput();
      const control = getSelectControl();

      fireEvent.focus(input);
      expect(control).toHaveAttribute('data-is-focused', 'true');

      rerender(<Select options={options} isDisabled />);
      expect(control).toHaveAttribute('data-is-focused', 'false');
    });

    it('focuses select state if programmatically re-enabled while focused (Firefox scenario)', () => {
      const { rerender } = render(<Select options={options} isDisabled />);
      const input = getSelectInput();
      const control = getSelectControl();

      // Simulate input being focused even if disabled (e.g., via browser behavior)
      setActiveElement(input);

      rerender(<Select options={options} isDisabled={false} />);
      expect(control).toHaveAttribute('data-is-focused', 'true');
    });
  });

  // --- 5. Menu and Options Tests ---
  describe('Menu and Options', () => {
    it('opens menu on focus if openMenuOnFocus is true', async () => {
      render(<Select options={options} openMenuOnFocus />);
      const input = getSelectInput();
      fireEvent.focus(input);
      expect(getMenuList()).toBeInTheDocument();
    });

    it('does not open menu on focus if openMenuOnFocus is false', async () => {
      render(<Select options={options} openMenuOnFocus={false} />);
      const input = getSelectInput();
      fireEvent.focus(input);
      expect(getMenuList()).not.toBeInTheDocument();
    });

    it('filters options based on inputValue', async () => {
      render(<Select options={options} />);
      const input = getSelectInput();
      userEvent.tab();
      fireEvent.keyDown(input, { key: 'ArrowDown' }); // Open menu

      expect(getAllOptions()).toHaveLength(options.length);

      fireEvent.change(input, { target: { value: 'o' } });
      expect(getOptionByLabel('Ocean')).toBeInTheDocument();
      expect(getOptionByLabel('Blue')).not.toBeInTheDocument(); // 'o' not in 'Blue'
      expect(getOptionByLabel('Red')).not.toBeInTheDocument();
      expect(getOptionByLabel('Green')).not.toBeInTheDocument();
      expect(getOptionByLabel('Yellow')).not.toBeInTheDocument();
      expect(getAllOptions()).toHaveLength(1); // Only Ocean

      fireEvent.change(input, { target: { value: 'bl' } });
      expect(getOptionByLabel('Ocean')).not.toBeInTheDocument();
      expect(getOptionByLabel('Blue')).toBeInTheDocument();
      expect(getAllOptions()).toHaveLength(1); // Only Blue
    });

    it('hides selected options from menu if hideSelectedOptions is true', async () => {
      render(<Select options={options} value={options[0]} hideSelectedOptions menuIsOpen />);
      expect(getOptionByLabel('Ocean')).not.toBeInTheDocument();
      expect(getOptionByLabel('Blue')).toBeInTheDocument();
    });

    it('does not hide selected options if hideSelectedOptions is false', async () => {
      render(<Select options={options} value={options[0]} hideSelectedOptions={false} menuIsOpen />);
      expect(getOptionByLabel('Ocean')).toBeInTheDocument();
    });

    it('hides selected options by default if isMulti is true', async () => {
      render(<Select options={options} value={options[0]} isMulti menuIsOpen />);
      expect(getOptionByLabel('Ocean')).not.toBeInTheDocument();
      expect(getOptionByLabel('Blue')).toBeInTheDocument();
    });

    it('does not hide selected options by default if isMulti is false', async () => {
      render(<Select options={options} value={options[0]} isMulti={false} menuIsOpen />);
      expect(getOptionByLabel('Ocean')).toBeInTheDocument();
    });

    it('renders grouped options correctly', () => {
      render(<Select options={groupedOptions} menuIsOpen />);
      expect(screen.getByTestId('Group', { name: 'Colors' })).toBeInTheDocument();
      expect(screen.getByTestId('Group', { name: 'Animals' })).toBeInTheDocument();
      expect(screen.getByTestId('GroupHeading', { name: 'Colors' })).toHaveTextContent('Colors');
      expect(getOptionByLabel('Red')).toBeInTheDocument();
      expect(getOptionByLabel('Cat')).toBeInTheDocument();
    });

    it('renders loading message when isLoading and no options', () => {
      render(<Select options={[]} isLoading loadingMessage={() => 'Custom Loading...'} menuIsOpen />);
      expect(screen.getByTestId('LoadingMessage')).toHaveTextContent('Custom Loading...');
      expect(getMenuList()).toBeInTheDocument();
      expect(screen.queryByTestId('NoOptionsMessage')).not.toBeInTheDocument();
    });

    it('renders no options message when no options and not loading', () => {
      render(<Select options={[]} noOptionsMessage={() => 'No results found.'} menuIsOpen />);
      expect(screen.getByTestId('NoOptionsMessage')).toHaveTextContent('No results found.');
      expect(getMenuList()).toBeInTheDocument();
      expect(screen.queryByTestId('LoadingMessage')).not.toBeInTheDocument();
    });

    it('calls onMenuScrollToTop and onMenuScrollToBottom', async () => {
      const onMenuScrollToTop = jest.fn();
      const onMenuScrollToBottom = jest.fn();
      render(
        <Select
          options={Array.from({ length: 50 }, (_, i) => ({ value: `v${i}`, label: `Option ${i}` }))}
          menuIsOpen
          onMenuScrollToTop={onMenuScrollToTop}
          onMenuScrollToBottom={onMenuScrollToBottom}
        />
      );
      const menuList = getMenuList();
      expect(menuList).toBeInTheDocument();

      // Simulate scroll to top
      fireEvent.scroll(menuList!, { target: { scrollTop: 0 } });
      expect(onMenuScrollToTop).toHaveBeenCalled();

      // Simulate scroll to bottom
      fireEvent.scroll(menuList!, { target: { scrollTop: menuList!.scrollHeight } });
      expect(onMenuScrollToBottom).toHaveBeenCalled();
    });

    it('blocks scroll events when menuShouldBlockScroll is true', async () => {
      render(<Select options={options} menuIsOpen menuShouldBlockScroll />);
      const scrollManager = screen.getByTestId('ScrollManager');
      expect(scrollManager).toHaveAttribute('data-capture-enabled', 'true');
      expect(scrollManager).toHaveAttribute('data-lock-enabled', 'true');
    });

    it('calls closeMenuOnScroll function when scrolling document', async () => {
      const handleMenuClose = jest.fn();
      const closeMenuOnScrollFn = jest.fn(() => true); // Always close
      render(<Select options={options} menuIsOpen closeMenuOnScroll={closeMenuOnScrollFn} onMenuClose={handleMenuClose} />);

      fireEvent.scroll(document.documentElement);
      expect(closeMenuOnScrollFn).toHaveBeenCalled();
      expect(handleMenuClose).toHaveBeenCalled();
    });

    it('does not close menu on scroll if closeMenuOnScroll function returns false', async () => {
      const handleMenuClose = jest.fn();
      const closeMenuOnScrollFn = jest.fn(() => false); // Never close
      render(<Select options={options} menuIsOpen closeMenuOnScroll={closeMenuOnScrollFn} onMenuClose={handleMenuClose} />);

      fireEvent.scroll(document.documentElement);
      expect(closeMenuOnScrollFn).toHaveBeenCalled();
      expect(handleMenuClose).not.toHaveBeenCalled();
    });

    it('closes menu on document scroll if closeMenuOnScroll is true', async () => {
      const handleMenuClose = jest.fn();
      render(<Select options={options} menuIsOpen closeMenuOnScroll={true} onMenuClose={handleMenuClose} />);

      fireEvent.scroll(document.documentElement);
      expect(handleMenuClose).toHaveBeenCalled();
    });

    it('does not close menu on document scroll if closeMenuOnScroll is false', async () => {
      const handleMenuClose = jest.fn();
      render(<Select options={options} menuIsOpen closeMenuOnScroll={false} onMenuClose={handleMenuClose} />);

      fireEvent.scroll(document.documentElement);
      expect(handleMenuClose).not.toHaveBeenCalled();
    });
  });

  // --- 6. Accessibility Testing ---
  describe('Accessibility', () => {
    it('updates aria-activedescendant when focused option changes (non-Apple device)', async () => {
      render(<Select options={options} />);
      const input = getSelectInput();
      userEvent.tab();
      fireEvent.keyDown(input, { key: 'ArrowDown' }); // Open menu, focus Ocean
      expect(input).toHaveAttribute('aria-activedescendant', 'react-select-test-1-option-0');

      fireEvent.keyDown(input, { key: 'ArrowDown' }); // Focus Blue
      expect(input).toHaveAttribute('aria-activedescendant', 'react-select-test-1-option-1');
    });

    it('does not update aria-activedescendant on Apple devices', async () => {
      mockIsAppleDevice.mockReturnValue(true);
      render(<Select options={options} />);
      const input = getSelectInput();
      userEvent.tab();
      fireEvent.keyDown(input, { key: 'ArrowDown' }); // Open menu, focus Ocean
      expect(input).not.toHaveAttribute('aria-activedescendant');
    });

    it('sets aria-selected on options', async () => {
      render(<Select options={options} value={options[0]} menuIsOpen />);
      expect(getOptionByLabel('Ocean')).toHaveAttribute('aria-selected', 'true');
      expect(getOptionByLabel('Blue')).toHaveAttribute('aria-selected', 'false');
    });

    it('LiveRegion announces initial input focus with value', async () => {
      render(<Select options={options} value={options[0]} />);
      const liveRegion = screen.getByTestId('LiveRegion');
      const input = getSelectInput();

      fireEvent.focus(input);
      await waitFor(() => {
        expect(liveRegion).toHaveTextContent('initial-input-focus: Ocean');
      });
    });

    it('LiveRegion announces selection changes', async () => {
      const handleChange = jest.fn();
      render(<Select options={options} onChange={handleChange} />);
      const liveRegion = screen.getByTestId('LiveRegion');
      const input = getSelectInput();

      userEvent.tab();
      fireEvent.keyDown(input, { key: 'ArrowDown' }); // Open menu
      fireEvent.keyDown(input, { key: 'Enter' }); // Select Ocean

      await waitFor(() => {
        expect(liveRegion).toHaveTextContent('select-option: Ocean');
      });

      // Clear value
      fireEvent.keyDown(input, { key: 'Escape' }); // Assuming escapeClearsValue is true by default for single select
      await waitFor(() => {
        expect(liveRegion).toHaveTextContent('clear: Ocean');
      });
    });

    it('LiveRegion announces removal of value in multi-select', async () => {
      const handleChange = jest.fn();
      render(<Select options={options} value={[options[0], options[1]]} isMulti onChange={handleChange} />);
      const liveRegion = screen.getByTestId('LiveRegion');
      const input = getSelectInput();

      userEvent.tab();
      fireEvent.keyDown(input, { key: 'Backspace' }); // Pop last value (Blue)

      await waitFor(() => {
        expect(liveRegion).toHaveTextContent('pop-value: Blue');
      });
    });
  });

  // --- 7. Edge Case Testing ---
  describe('Edge Cases', () => {
    it('handles empty options array gracefully', () => {
      render(<Select options={[]} menuIsOpen />);
      expect(getMenuList()).toBeInTheDocument();
      expect(screen.getByTestId('NoOptionsMessage')).toHaveTextContent('No options');
    });

    it('does not open menu if isDisabled is true', async () => {
      render(<Select options={options} isDisabled />);
      const input = getSelectInput();
      userEvent.tab();
      expect(input).not.toHaveFocus(); // Cannot focus disabled input
      fireEvent.click(getSelectControl());
      expect(getMenuList()).not.toBeInTheDocument();
    });

    it('does not allow selection of disabled options', async () => {
      const handleChange = jest.fn();
      render(<Select options={options} onChange={handleChange} menuIsOpen />);
      const disabledOption = getOptionByLabel('Green');
      fireEvent.click(disabledOption!);
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('handles custom formatOptionLabel', () => {
      const customFormat = jest.fn((option, { context }) => `${option.label} (${context})`);
      render(<Select options={options} value={options[0]} formatOptionLabel={customFormat} menuIsOpen />);

      // In menu
      expect(getOptionByLabel('Ocean (menu)')).toBeInTheDocument();
      // In value container
      expect(screen.getByTestId('SingleValue')).toHaveTextContent('Ocean (value)');
      expect(customFormat).toHaveBeenCalledWith(options[0], { context: 'value', inputValue: '', selectValue: [options[0]] });
      expect(customFormat).toHaveBeenCalledWith(options[0], { context: 'menu', inputValue: '', selectValue: [options[0]] });
    });

    it('handles custom formatGroupLabel', () => {
      const customFormat = jest.fn((group) => `Group: ${group.label}`);
      render(<Select options={groupedOptions} formatGroupLabel={customFormat} menuIsOpen />);
      expect(screen.getByTestId('GroupHeading', { name: 'Group: Colors' })).toBeInTheDocument();
      expect(customFormat).toHaveBeenCalledWith(groupedOptions[0]);
    });

    it('handles custom isOptionDisabled', () => {
      const customIsOptionDisabled = jest.fn((option) => option.value === 'blue');
      render(<Select options={options} isOptionDisabled={customIsOptionDisabled} menuIsOpen />);
      expect(getOptionByLabel('Blue')).toHaveAttribute('data-is-disabled', 'true');
      expect(getOptionByLabel('Ocean')).not.toHaveAttribute('data-is-disabled', 'true');
      expect(customIsOptionDisabled).toHaveBeenCalledWith(options[1], []);
    });

    it('handles custom isOptionSelected', () => {
      const customIsOptionSelected = jest.fn((option, selectValue) => selectValue.some(s => s.value === option.value));
      render(<Select options={options} value={options[0]} isOptionSelected={customIsOptionSelected} menuIsOpen />);
      expect(getOptionByLabel('Ocean')).toHaveAttribute('aria-selected', 'true');
      expect(customIsOptionSelected).toHaveBeenCalledWith(options[0], [options[0]]);
    });

    it('handles custom filterOption', () => {
      const customFilter = jest.fn((option, inputValue) => option.label.startsWith(inputValue));
      render(<Select options={options} filterOption={customFilter} />);
      const input = getSelectInput();
      userEvent.tab();
      fireEvent.keyDown(input, { key: 'ArrowDown' }); // Open menu

      fireEvent.change(input, { target: { value: 'O' } });
      expect(getOptionByLabel('Ocean')).toBeInTheDocument();
      expect(getOptionByLabel('Blue')).not.toBeInTheDocument();
      expect(customFilter).toHaveBeenCalledWith({ label: 'Ocean', value: 'ocean', data: options[0] }, 'O');
    });

    it('handles menuPortalTarget and menuPosition="fixed"', () => {
      const portalTarget = document.createElement('div');
      portalTarget.setAttribute('id', 'portal-root');
      document.body.appendChild(portalTarget);

      const { rerender } = render(<Select options={options} menuIsOpen menuPortalTarget={portalTarget} />);
      expect(screen.getByTestId('MenuPortal')).toBeInTheDocument();
      expect(screen.getByTestId('MenuPortal')).toHaveAttribute('data-append-to', 'true'); // Mocked to check existence

      rerender(<Select options={options} menuIsOpen menuPosition="fixed" />);
      expect(screen.getByTestId('MenuPortal')).toBeInTheDocument();
      expect(screen.getByTestId('MenuPortal')).toHaveAttribute('menu-position', 'fixed');

      document.body.removeChild(portalTarget);
    });

    it('calls onKeyDown prop', () => {
      const handleKeyDown = jest.fn();
      render(<Select options={options} onKeyDown={handleKeyDown} />);
      const input = getSelectInput();
      fireEvent.keyDown(input, { key: 'A' });
      expect(handleKeyDown).toHaveBeenCalled();
    });

    it('prevents default on onKeyDown if onKeyDown prop prevents default', () => {
      const handleKeyDown = jest.fn((e) => e.preventDefault());
      render(<Select options={options} onKeyDown={handleKeyDown} />);
      const input = getSelectInput();
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true });
      fireEvent(input, event);
      expect(handleKeyDown).toHaveBeenCalled();
      expect(event.defaultPrevented).toBe(true);
      expect(getMenuList()).not.toBeInTheDocument(); // Menu should not open
    });

    it('handles composition events', async () => {
      render(<Select options={options} />);
      const input = getSelectInput();

      // Simulate composition start
      fireEvent.compositionStart(input);
      fireEvent.keyDown(input, { key: 'Enter' }); // Should be ignored
      expect(getMenuList()).not.toBeInTheDocument(); // Menu should not open

      // Simulate composition end
      fireEvent.compositionEnd(input);
      fireEvent.keyDown(input, { key: 'Enter' }); // Should now work
      expect(getMenuList()).toBeInTheDocument(); // Menu should open (as Enter would select focused option, but here it opens if no focused option)
    });

    it('calls onInputChange with correct action meta', async () => {
      const onInputChange = jest.fn();
      render(<Select options={options} onInputChange={onInputChange} />);
      const input = getSelectInput();

      fireEvent.change(input, { target: { value: 'test' } });
      expect(onInputChange).toHaveBeenCalledWith('test', { action: 'input-change', prevInputValue: '' });

      fireEvent.blur(input);
      expect(onInputChange).toHaveBeenCalledWith('', { action: 'input-blur', prevInputValue: 'test' });

      fireEvent.keyDown(input, { key: 'Escape' }); // Close menu
      expect(onInputChange).toHaveBeenCalledWith('', { action: 'menu-close', prevInputValue: '' });

      // Select an option
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(onInputChange).toHaveBeenCalledWith('', { action: 'set-value', prevInputValue: '' });
    });
  });

  // --- 8. Performance Testing (Conceptual) ---
  describe('Performance (Conceptual)', () => {
    it('renders large option sets without crashing', () => {
      const largeOptions = Array.from({ length: 1000 }, (_, i) => ({ value: `v${i}`, label: `Option ${i}` }));
      const { container } = render(<Select options={largeOptions} menuIsOpen />);
      expect(container).toBeInTheDocument();
      expect(getAllOptions()).toHaveLength(1000); // Verify all options are rendered
    });
  });

  // --- 9. Test Coverage Requirements ---
  // The tests above aim for high code coverage by systematically exercising
  // different paths, props, and interactions. Mocks are used extensively
  // to isolate the component under test and control external dependencies.

  // --- 10. Test Documentation ---
  // Tests are grouped logically using `describe` blocks, and individual
  // test cases are clearly named using `it` or `test`.
});
```

### Tokens: {'input_tokens': 18518, 'output_tokens': 53053, 'reasoning_tokens': 18087}
### Execution time: 142.98067903518677
