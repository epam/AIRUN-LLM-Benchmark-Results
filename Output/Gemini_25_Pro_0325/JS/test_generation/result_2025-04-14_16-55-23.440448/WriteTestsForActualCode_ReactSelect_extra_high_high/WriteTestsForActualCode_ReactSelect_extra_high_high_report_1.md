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
Okay, let's create a comprehensive unit test suite for the `Select` component using Jest and React Testing Library.

**1. Test Environment Setup**

First, ensure you have the necessary dependencies installed:

```bash
npm install --save-dev jest @types/jest ts-jest @testing-library/react @testing-library/jest-dom @testing-library/user-event
# or
yarn add --dev jest @types/jest ts-jest @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

Configure Jest (e.g., in `jest.config.js` or `package.json`):

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'], // Or wherever your setup file is
  moduleNameMapper: {
    // Add any necessary module mappings if you use aliases
    // Example: '^@components/(.*)$': '<rootDir>/src/components/$1'
  },
  // Optional: Collect coverage
  collectCoverage: true,
  coverageReporters: ["json", "lcov", "text", "clover"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  coveragePathIgnorePatterns: [
    // Ignore files not relevant for coverage (e.g., types, styles, index files re-exporting)
    "/node_modules/",
    "src/types",
    "src/styles",
    "src/theme",
    "src/components/index.ts",
    "src/internal/index.ts",
    "src/accessibility/index.ts",
    "src/filters.ts", // Assuming createFilter is well-tested separately if complex
    "src/builtins.ts", // Assuming builtins are simple or tested elsewhere
    "src/utils.ts", // Assuming utils are tested separately
    "src/accessibility/helpers.ts",
  ],
};
```

Create a setup file (e.g., `src/setupTests.ts`):

```typescript
// src/setupTests.ts
import '@testing-library/jest-dom';

// Mock browser APIs not available in JSDOM or causing issues
// Mock scrollIntoView as it doesn't exist in JSDOM
Element.prototype.scrollIntoView = jest.fn();

// Mock matchMedia (often used by libraries for responsive checks)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver (might be used by MenuPlacer or similar)
global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));

// Mock isTouchCapable and isMobileDevice if they rely on browser specifics
jest.mock('./utils', () => ({
  ...jest.requireActual('./utils'), // Keep original functions
  isTouchCapable: jest.fn(() => false), // Default mock to non-touch
  isMobileDevice: jest.fn(() => false), // Default mock to non-mobile
}));

// Mock MenuPlacer to simplify testing focus on Select logic
// This avoids complexities of portal/positioning logic in Select tests
jest.mock('./components/Menu', () => ({
  MenuPlacer: jest.fn(({ children, ...props }) => {
    // Directly render children, passing necessary props if needed
    // The ref and placerProps are simplified here
    const mockRef = jest.fn();
    const mockPlacerProps = { placement: 'bottom', maxHeight: 300 };
    return children({ ref: mockRef, placerProps: mockPlacerProps });
  }),
}));

// Mock LiveRegion to prevent noise during tests unless specifically testing it
jest.mock('./components/LiveRegion', () => {
  return jest.fn(() => <div data-testid="mock-live-region"></div>);
});

// Mock ScrollManager
jest.mock('./internal/ScrollManager', () => ({
  ScrollManager: jest.fn(({ children }) => {
    const mockScrollTargetRef = jest.fn();
    return children(mockScrollTargetRef);
  }),
}));

// Mock accessibility helpers if needed
jest.mock('./accessibility/helpers', () => ({
  isAppleDevice: jest.fn(() => false), // Default mock to non-Apple
}));

// Mock default components if they have complex internal logic or side effects
// jest.mock('./components/index', () => ({
//   ...jest.requireActual('./components/index'),
//   defaultComponents: jest.fn((props) => jest.requireActual('./components/index').defaultComponents(props)),
// }));

// Silence console.error/warn during tests if expected errors occur (e.g., required prop warnings)
// let originalError: any;
// beforeEach(() => {
//   originalError = console.error;
//   console.error = jest.fn();
// });
// afterEach(() => {
//   console.error = originalError;
// });
```

**2. Test File (`Select.test.tsx`)**

```typescript
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Select, { Props, defaultProps } from './index'; // Adjust path if needed
import { GroupBase } from './types';
import * as utils from './utils'; // Import to spy on mocked functions

// --- Test Data ---
interface OptionType {
  value: string;
  label: string;
  isDisabled?: boolean;
}

interface GroupType extends GroupBase<OptionType> {
  label: string;
  options: readonly OptionType[];
}

const options: OptionType[] = [
  { value: 'one', label: 'One' },
  { value: 'two', label: 'Two' },
  { value: 'three', label: 'Three', isDisabled: true },
  { value: 'four', label: 'Four' },
];

const groupedOptions: GroupType[] = [
  {
    label: 'Group 1',
    options: [options[0], options[1]],
  },
  {
    label: 'Group 2',
    options: [options[2], options[3]],
  },
];

const defaultTestProps: Partial<Props<OptionType, false, GroupType>> = {
  options: options,
  inputId: 'test-input-id',
  instanceId: 'test-instance-id',
  onChange: jest.fn(),
  onInputChange: jest.fn(),
  onMenuOpen: jest.fn(),
  onMenuClose: jest.fn(),
  onFocus: jest.fn(),
  onBlur: jest.fn(),
};

// --- Helper Functions ---
const renderSelect = <IsMulti extends boolean = false>(
  props: Partial<Props<OptionType, IsMulti, GroupType>> = {}
) => {
  const mergedProps = { ...defaultTestProps, ...props } as Props<OptionType, IsMulti, GroupType>;
  const user = userEvent.setup();
  const result = render(<Select {...mergedProps} />);
  const rerender = (newProps: Partial<Props<OptionType, IsMulti, GroupType>>) =>
    result.rerender(<Select {...{ ...mergedProps, ...newProps }} />);

  // Helper to get the control element (the main clickable area)
  const getControl = () => screen.getByRole('combobox').closest('div[class*="-control"]')!;
  // Helper to get the input element
  const getInput = () => screen.getByRole('combobox') as HTMLInputElement;

  return { ...result, rerender, user, getControl, getInput };
};

// --- Test Suite ---

describe('Select Component', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset specific mocks to default behavior if needed
    (utils.isTouchCapable as jest.Mock).mockReturnValue(false);
    (utils.isMobileDevice as jest.Mock).mockReturnValue(false);
  });

  // --- Rendering Tests ---
  describe('Rendering', () => {
    it('should render the select container and control', () => {
      renderSelect();
      expect(screen.getByRole('combobox').closest('div[class*="-container"]')).toBeInTheDocument();
      expect(screen.getByRole('combobox').closest('div[class*="-control"]')).toBeInTheDocument();
    });

    it('should render the input with default props', () => {
      renderSelect();
      const input = screen.getByRole('combobox');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('id', 'test-input-id');
      expect(input).toHaveAttribute('aria-autocomplete', 'list');
      expect(input).toHaveAttribute('aria-expanded', 'false');
      expect(input).toHaveAttribute('aria-haspopup', 'true');
      expect(input).toHaveAttribute('tabindex', '0'); // from defaultProps
    });

    it('should render placeholder when no value is selected', () => {
      renderSelect({ placeholder: 'Select an option...' });
      expect(screen.getByText('Select an option...')).toBeInTheDocument();
      expect(screen.getByText('Select an option...')).toHaveAttribute('id', 'react-select-test-instance-id-placeholder');
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-describedby', 'react-select-test-instance-id-placeholder');
    });

    it('should render single value when selected', () => {
      renderSelect({ value: options[0] });
      expect(screen.getByText('One')).toBeInTheDocument();
      expect(screen.queryByText(defaultProps.placeholder as string)).not.toBeInTheDocument();
    });

    it('should render multi values when selected', () => {
      renderSelect<true>({ isMulti: true, value: [options[0], options[1]] });
      expect(screen.getByText('One')).toBeInTheDocument();
      expect(screen.getByText('Two')).toBeInTheDocument();
      // Check for MultiValueRemove buttons
      expect(screen.getAllByLabelText('Remove One').length).toBeGreaterThan(0); // Assuming MultiValueRemove has aria-label
      expect(screen.getAllByLabelText('Remove Two').length).toBeGreaterThan(0);
    });

    it('should render className and classNamePrefix', () => {
      renderSelect({ className: 'custom-class', classNamePrefix: 'custom-prefix' });
      expect(screen.getByRole('combobox').closest('.custom-class')).toBeInTheDocument();
      expect(screen.getByRole('combobox').closest('.custom-prefix__control')).toBeInTheDocument();
      expect(screen.getByRole('combobox').closest('.custom-prefix__value-container')).toBeInTheDocument();
    });

    it('should render indicators (dropdown, separator, clear)', () => {
      renderSelect({ isClearable: true, value: options[0] });
      // Use querySelector for potentially complex class names or structure
      expect(screen.getByRole('combobox').closest('div[class*="-control"]')!.querySelector('div[class*="-indicator-separator"]')).toBeInTheDocument();
      expect(screen.getByRole('combobox').closest('div[class*="-control"]')!.querySelector('div[class*="-dropdown-indicator"]')).toBeInTheDocument();
      expect(screen.getByRole('combobox').closest('div[class*="-control"]')!.querySelector('div[class*="-clear-indicator"]')).toBeInTheDocument();
    });

    it('should not render clear indicator if not clearable or no value', () => {
      const { rerender } = renderSelect({ isClearable: false, value: options[0] });
      expect(screen.queryByLabelText('Clear selection')).not.toBeInTheDocument(); // Assuming aria-label
      expect(screen.queryByRole('button', { name: /clear/i })).not.toBeInTheDocument(); // Alternative query

      rerender({ isClearable: true, value: null });
      expect(screen.queryByLabelText('Clear selection')).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /clear/i })).not.toBeInTheDocument();
    });

    it('should render loading indicator when isLoading is true', () => {
      renderSelect({ isLoading: true });
      expect(screen.getByRole('combobox').closest('div[class*="-control"]')!.querySelector('div[class*="-loading-indicator"]')).toBeInTheDocument();
      // Clear indicator should be hidden when loading
      expect(screen.queryByLabelText('Clear selection')).not.toBeInTheDocument();
    });

    it('should render hidden input for form submission', () => {
      renderSelect({ name: 'my-select', value: options[0] });
      const hiddenInput = document.querySelector('input[name="my-select"][type="hidden"]');
      expect(hiddenInput).toBeInTheDocument();
      expect(hiddenInput).toHaveValue('one');
    });

     it('should render multiple hidden inputs for multi-select form submission', () => {
      renderSelect<true>({ name: 'my-multi-select', isMulti: true, value: [options[0], options[1]] });
      const hiddenInputs = document.querySelectorAll('input[name="my-multi-select"][type="hidden"]');
      expect(hiddenInputs).toHaveLength(2);
      expect(hiddenInputs[0]).toHaveValue('one');
      expect(hiddenInputs[1]).toHaveValue('two');
    });

    it('should render required input when required and no value', () => {
        renderSelect({ name: 'req-select', required: true, value: null });
        const requiredInput = screen.getByTestId('required-input'); // Assuming RequiredInput has data-testid
        expect(requiredInput).toBeInTheDocument();
        expect(requiredInput).toHaveAttribute('name', 'req-select');
    });

    it('should not render required input when not required or has value', () => {
        const { rerender } = renderSelect({ name: 'req-select', required: false, value: null });
        expect(screen.queryByTestId('required-input')).not.toBeInTheDocument();

        rerender({ name: 'req-select', required: true, value: options[0] });
        expect(screen.queryByTestId('required-input')).not.toBeInTheDocument();
    });

    it('should render dummy input when isSearchable is false', () => {
        renderSelect({ isSearchable: false });
        const input = screen.getByRole('combobox');
        expect(input).toHaveAttribute('inputmode', 'none');
        expect(input).toHaveAttribute('aria-readonly', 'true');
    });
  });

  // --- Menu and Options Tests ---
  describe('Menu and Options', () => {
    it('should open menu when control is clicked (if openMenuOnClick)', async () => {
      const { user, getControl, getInput } = renderSelect({ openMenuOnClick: true, onMenuOpen: jest.fn() });
      await user.click(getControl());
      expect(await screen.findByRole('listbox')).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'true');
      expect(defaultTestProps.onMenuOpen).toHaveBeenCalledTimes(1);
      // Input should be focused
      expect(getInput()).toHaveFocus();
    });

     it('should open menu when dropdown indicator is clicked', async () => {
      const { user, getControl, getInput } = renderSelect({ onMenuOpen: jest.fn() });
      const indicator = getControl().querySelector('div[class*="-dropdown-indicator"]')!;
      await user.click(indicator);
      expect(await screen.findByRole('listbox')).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'true');
      expect(defaultTestProps.onMenuOpen).toHaveBeenCalledTimes(1);
      expect(getInput()).toHaveFocus();
    });

    it('should close menu when Escape key is pressed', async () => {
      const { user, getControl, getInput } = renderSelect({ onMenuClose: jest.fn() });
      await user.click(getControl()); // Open menu
      expect(await screen.findByRole('listbox')).toBeInTheDocument();

      await user.keyboard('{Escape}');
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false');
      expect(defaultTestProps.onMenuClose).toHaveBeenCalledTimes(1);
      expect(getInput()).toHaveFocus(); // Focus should remain
    });

    it('should close menu when an option is selected (if closeMenuOnSelect)', async () => {
      const { user, getControl } = renderSelect({ closeMenuOnSelect: true, onMenuClose: jest.fn() });
      await user.click(getControl());
      const option = await screen.findByText('Two');
      await user.click(option);

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      expect(defaultTestProps.onMenuClose).toHaveBeenCalledTimes(1);
      expect(defaultTestProps.onChange).toHaveBeenCalledWith(options[1], expect.objectContaining({ action: 'select-option' }));
    });

     it('should NOT close menu when an option is selected if closeMenuOnSelect is false', async () => {
      const { user, getControl } = renderSelect<true>({ isMulti: true, closeMenuOnSelect: false, onMenuClose: jest.fn() });
      await user.click(getControl());
      const option = await screen.findByText('Two');
      await user.click(option);

      expect(screen.queryByRole('listbox')).toBeInTheDocument(); // Menu stays open
      expect(defaultTestProps.onMenuClose).not.toHaveBeenCalled();
      expect(defaultTestProps.onChange).toHaveBeenCalledWith([options[1]], expect.objectContaining({ action: 'select-option', option: options[1] }));
    });

    it('should render options correctly', async () => {
      const { user, getControl } = renderSelect();
      await user.click(getControl());
      const listbox = await screen.findByRole('listbox');
      const optionElements = await screen.findAllByRole('option');

      expect(listbox).toBeInTheDocument();
      expect(optionElements).toHaveLength(options.length);
      expect(screen.getByText('One')).toBeInTheDocument();
      expect(screen.getByText('Two')).toBeInTheDocument();
      expect(screen.getByText('Three')).toBeInTheDocument(); // Disabled option still renders
      expect(screen.getByText('Four')).toBeInTheDocument();
    });

    it('should render grouped options correctly', async () => {
      const { user, getControl } = renderSelect({ options: groupedOptions });
      await user.click(getControl());
      expect(await screen.findByRole('listbox')).toBeInTheDocument();
      expect(screen.getByText('Group 1')).toBeInTheDocument();
      expect(screen.getByText('Group 2')).toBeInTheDocument();
      // Check options within groups (might need more specific selectors if structure is complex)
      expect(screen.getByText('One')).toBeInTheDocument();
      expect(screen.getByText('Four')).toBeInTheDocument();
      expect(screen.getAllByRole('group')).toHaveLength(groupedOptions.length);
    });

    it('should filter options based on input value', async () => {
      const { user, getInput } = renderSelect();
      await user.type(getInput(), 'o'); // Should match One, Two, Four
      const listbox = await screen.findByRole('listbox');
      expect(listbox).toBeInTheDocument();
      expect(screen.getByText('One')).toBeInTheDocument();
      expect(screen.getByText('Two')).toBeInTheDocument();
      expect(screen.queryByText('Three')).not.toBeInTheDocument(); // Doesn't match 'o'
      expect(screen.getByText('Four')).toBeInTheDocument();
      expect(defaultTestProps.onInputChange).toHaveBeenCalledWith('o', expect.objectContaining({ action: 'input-change' }));
    });

    it('should show "No options" message when filter returns no results', async () => {
      const { user, getInput } = renderSelect({ noOptionsMessage: () => 'No results found' });
      await user.type(getInput(), 'xyz');
      expect(await screen.findByText('No results found')).toBeInTheDocument();
      expect(screen.queryByRole('option')).not.toBeInTheDocument();
    });

    it('should hide selected options if hideSelectedOptions is true (multi)', async () => {
        const { user, getControl } = renderSelect<true>({
            isMulti: true,
            value: [options[0]],
            hideSelectedOptions: true,
        });
        await user.click(getControl());
        await screen.findByRole('listbox');
        expect(screen.queryByText('One')).not.toBeInTheDocument(); // Should be hidden
        expect(screen.getByText('Two')).toBeInTheDocument();
    });

    it('should handle disabled options', async () => {
      const { user, getControl } = renderSelect();
      await user.click(getControl());
      const disabledOption = await screen.findByText('Three');
      expect(disabledOption).toHaveAttribute('aria-disabled', 'true');

      // Try clicking disabled option
      await user.click(disabledOption);
      expect(defaultTestProps.onChange).not.toHaveBeenCalled(); // Should not select
      expect(screen.queryByRole('listbox')).toBeInTheDocument(); // Menu should remain open
    });
  });

  // --- User Interaction Testing ---
  describe('User Interaction', () => {
    // --- Keyboard Navigation ---
    describe('Keyboard Navigation', () => {
      it('should open menu and focus first option on ArrowDown', async () => {
        const { user, getInput } = renderSelect({ onMenuOpen: jest.fn() });
        getInput().focus();
        await user.keyboard('{ArrowDown}');
        const listbox = await screen.findByRole('listbox');
        expect(listbox).toBeInTheDocument();
        expect(defaultTestProps.onMenuOpen).toHaveBeenCalledTimes(1);
        expect(screen.getByText('One')).toHaveClass('custom-prefix__option--is-focused'); // Assuming focus class
        expect(getInput()).toHaveAttribute('aria-activedescendant', 'react-select-test-instance-id-option-0');
      });

      it('should open menu and focus last option on ArrowUp', async () => {
        const { user, getInput } = renderSelect({ onMenuOpen: jest.fn() });
        getInput().focus();
        await user.keyboard('{ArrowUp}');
        const listbox = await screen.findByRole('listbox');
        expect(listbox).toBeInTheDocument();
        expect(defaultTestProps.onMenuOpen).toHaveBeenCalledTimes(1);
        expect(screen.getByText('Four')).toHaveClass('custom-prefix__option--is-focused');
        expect(getInput()).toHaveAttribute('aria-activedescendant', 'react-select-test-instance-id-option-3'); // Index 3 is 'Four'
      });

      it('should cycle through options with ArrowDown/ArrowUp when menu is open', async () => {
        const { user, getControl, getInput } = renderSelect();
        await user.click(getControl()); // Open menu
        await screen.findByRole('listbox');

        // Initial focus might be tricky, let's force focus on input and press down
        getInput().focus();
        await user.keyboard('{ArrowDown}'); // Focus One
        expect(screen.getByText('One')).toHaveClass('custom-prefix__option--is-focused');
        expect(getInput()).toHaveAttribute('aria-activedescendant', 'react-select-test-instance-id-option-0');

        await user.keyboard('{ArrowDown}'); // Focus Two
        expect(screen.getByText('Two')).toHaveClass('custom-prefix__option--is-focused');
        expect(getInput()).toHaveAttribute('aria-activedescendant', 'react-select-test-instance-id-option-1');

        // Skip disabled 'Three'
        await user.keyboard('{ArrowDown}'); // Focus Four
        expect(screen.getByText('Four')).toHaveClass('custom-prefix__option--is-focused');
        expect(getInput()).toHaveAttribute('aria-activedescendant', 'react-select-test-instance-id-option-3');

        await user.keyboard('{ArrowDown}'); // Wrap to One
        expect(screen.getByText('One')).toHaveClass('custom-prefix__option--is-focused');
        expect(getInput()).toHaveAttribute('aria-activedescendant', 'react-select-test-instance-id-option-0');

        await user.keyboard('{ArrowUp}'); // Wrap to Four
        expect(screen.getByText('Four')).toHaveClass('custom-prefix__option--is-focused');
        expect(getInput()).toHaveAttribute('aria-activedescendant', 'react-select-test-instance-id-option-3');
      });

      it('should select focused option on Enter', async () => {
        const { user, getInput } = renderSelect();
        getInput().focus();
        await user.keyboard('{ArrowDown}'); // Focus One
        await screen.findByRole('listbox');
        await user.keyboard('{Enter}');

        expect(defaultTestProps.onChange).toHaveBeenCalledWith(options[0], expect.objectContaining({ action: 'select-option' }));
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument(); // Menu closes
        expect(screen.getByText('One')).toBeInTheDocument(); // Value updated
      });

      it('should select focused option on Tab (if tabSelectsValue)', async () => {
        const { user, getInput } = renderSelect({ tabSelectsValue: true });
        getInput().focus();
        await user.keyboard('{ArrowDown}'); // Focus One
        await screen.findByRole('listbox');
        await user.keyboard('{Tab}');

        expect(defaultTestProps.onChange).toHaveBeenCalledWith(options[0], expect.objectContaining({ action: 'select-option' }));
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument(); // Menu closes
        expect(screen.getByText('One')).toBeInTheDocument(); // Value updated
      });

       it('should NOT select focused option on Tab if tabSelectsValue is false', async () => {
        const { user, getInput } = renderSelect({ tabSelectsValue: false });
        getInput().focus();
        await user.keyboard('{ArrowDown}'); // Focus One
        await screen.findByRole('listbox');
        await user.keyboard('{Tab}'); // Should just blur or move focus

        expect(defaultTestProps.onChange).not.toHaveBeenCalled();
        // Depending on setup, focus might move or input might blur
        // expect(getInput()).not.toHaveFocus(); // Check blur if expected
      });

      it('should clear value on Backspace if single, clearable, and no input value', async () => {
        const { user, getInput } = renderSelect({ isClearable: true, value: options[0] });
        getInput().focus();
        await user.keyboard('{Backspace}');
        expect(defaultTestProps.onChange).toHaveBeenCalledWith(null, expect.objectContaining({ action: 'clear', removedValues: [options[0]] }));
      });

      it('should pop value on Backspace if multi and no input value', async () => {
        const { user, getInput } = renderSelect<true>({ isMulti: true, value: [options[0], options[1]] });
        getInput().focus();
        await user.keyboard('{Backspace}');
        expect(defaultTestProps.onChange).toHaveBeenCalledWith([options[0]], expect.objectContaining({ action: 'pop-value', removedValue: options[1] }));
      });

       it('should NOT remove value on Backspace if backspaceRemovesValue is false', async () => {
        const { user, getInput } = renderSelect<true>({ isMulti: true, value: [options[0], options[1]], backspaceRemovesValue: false });
        getInput().focus();
        await user.keyboard('{Backspace}');
        expect(defaultTestProps.onChange).not.toHaveBeenCalled();
      });

      it('should clear value on Escape if menu is closed, clearable, and escapeClearsValue', async () => {
        const { user, getInput } = renderSelect({ isClearable: true, escapeClearsValue: true, value: options[0] });
        getInput().focus();
        await user.keyboard('{Escape}'); // Menu is closed, should clear
        expect(defaultTestProps.onChange).toHaveBeenCalledWith(null, expect.objectContaining({ action: 'clear', removedValues: [options[0]] }));
      });

      it('should navigate pages with PageUp/PageDown', async () => {
          const manyOptions = Array.from({ length: 15 }, (_, i) => ({ value: `val-${i}`, label: `Option ${i}` }));
          const { user, getControl, getInput } = renderSelect({ options: manyOptions, pageSize: 5 });
          await user.click(getControl());
          await screen.findByRole('listbox');
          getInput().focus();

          await user.keyboard('{PageDown}'); // Focus Option 5 (index 5)
          expect(screen.getByText('Option 5')).toHaveClass('custom-prefix__option--is-focused');
          expect(getInput()).toHaveAttribute('aria-activedescendant', 'react-select-test-instance-id-option-5');

          await user.keyboard('{PageDown}'); // Focus Option 10 (index 10)
          expect(screen.getByText('Option 10')).toHaveClass('custom-prefix__option--is-focused');
          expect(getInput()).toHaveAttribute('aria-activedescendant', 'react-select-test-instance-id-option-10');

          await user.keyboard('{PageUp}'); // Focus Option 5 (index 5)
          expect(screen.getByText('Option 5')).toHaveClass('custom-prefix__option--is-focused');
          expect(getInput()).toHaveAttribute('aria-activedescendant', 'react-select-test-instance-id-option-5');
      });

       it('should navigate to first/last option with Home/End', async () => {
          const { user, getControl, getInput } = renderSelect();
          await user.click(getControl());
          await screen.findByRole('listbox');
          getInput().focus();

          await user.keyboard('{End}'); // Focus Four (last focusable)
          expect(screen.getByText('Four')).toHaveClass('custom-prefix__option--is-focused');
          expect(getInput()).toHaveAttribute('aria-activedescendant', 'react-select-test-instance-id-option-3');

          await user.keyboard('{Home}'); // Focus One (first focusable)
          expect(screen.getByText('One')).toHaveClass('custom-prefix__option--is-focused');
          expect(getInput()).toHaveAttribute('aria-activedescendant', 'react-select-test-instance-id-option-0');
      });
    });

    // --- Mouse Interaction ---
    describe('Mouse Interaction', () => {
      it('should select option on click', async () => {
        const { user, getControl } = renderSelect();
        await user.click(getControl());
        const optionElement = await screen.findByText('Two');
        await user.click(optionElement);
        expect(defaultTestProps.onChange).toHaveBeenCalledWith(options[1], expect.objectContaining({ action: 'select-option' }));
        expect(screen.getByText('Two')).toBeInTheDocument(); // Value updated in control
      });

      it('should clear value when clear indicator is clicked', async () => {
        const { user, getControl } = renderSelect({ isClearable: true, value: options[0] });
        const clearButton = getControl().querySelector('div[class*="-clear-indicator"]')!;
        await user.click(clearButton);
        expect(defaultTestProps.onChange).toHaveBeenCalledWith(null, expect.objectContaining({ action: 'clear', removedValues: [options[0]] }));
        expect(screen.getByText(defaultProps.placeholder as string)).toBeInTheDocument(); // Placeholder shown
      });

      it('should remove value when multi-value remove icon is clicked', async () => {
        const { user } = renderSelect<true>({ isMulti: true, value: [options[0], options[1]] });
        const removeButton = screen.getByLabelText('Remove One'); // Assumes aria-label
        await user.click(removeButton);
        expect(defaultTestProps.onChange).toHaveBeenCalledWith([options[1]], expect.objectContaining({ action: 'remove-value', removedValue: options[0] }));
        expect(screen.queryByText('One')).not.toBeInTheDocument();
        expect(screen.getByText('Two')).toBeInTheDocument();
      });

      it('should focus option on hover', async () => {
        const { user, getControl, getInput } = renderSelect();
        await user.click(getControl());
        const optionElement = await screen.findByText('Two');
        await user.hover(optionElement);
        // Need waitFor because hover might have slight delay in state update
        await waitFor(() => {
            expect(optionElement).toHaveClass('custom-prefix__option--is-focused');
            expect(getInput()).toHaveAttribute('aria-activedescendant', 'react-select-test-instance-id-option-1');
        });

        // Hovering another option changes focus
        const anotherOption = screen.getByText('Four');
        await user.hover(anotherOption);
         await waitFor(() => {
            expect(anotherOption).toHaveClass('custom-prefix__option--is-focused');
            expect(getInput()).toHaveAttribute('aria-activedescendant', 'react-select-test-instance-id-option-3');
            expect(optionElement).not.toHaveClass('custom-prefix__option--is-focused');
        });
      });
    });

    // --- Touch Interaction (Simulated) ---
    describe('Touch Interaction', () => {
        beforeEach(() => {
            // Mock touch environment for these tests
            (utils.isTouchCapable as jest.Mock).mockReturnValue(true);
        });

        it('should open menu on control touch end', async () => {
            const { getControl } = renderSelect({ onMenuOpen: jest.fn() });
            fireEvent.touchEnd(getControl());
            expect(await screen.findByRole('listbox')).toBeInTheDocument();
            expect(defaultTestProps.onMenuOpen).toHaveBeenCalledTimes(1);
        });

        it('should clear value on clear indicator touch end', async () => {
            const { getControl } = renderSelect({ isClearable: true, value: options[0] });
            const clearIndicator = getControl().querySelector('div[class*="-clear-indicator"]')!;
            fireEvent.touchEnd(clearIndicator);
            expect(defaultTestProps.onChange).toHaveBeenCalledWith(null, expect.objectContaining({ action: 'clear' }));
        });

        it('should toggle menu on dropdown indicator touch end', async () => {
            const { getControl } = renderSelect({ onMenuOpen: jest.fn(), onMenuClose: jest.fn() });
            const dropdownIndicator = getControl().querySelector('div[class*="-dropdown-indicator"]')!;

            // Open
            fireEvent.touchEnd(dropdownIndicator);
            expect(await screen.findByRole('listbox')).toBeInTheDocument();
            expect(defaultTestProps.onMenuOpen).toHaveBeenCalledTimes(1);

            // Close
            fireEvent.touchEnd(dropdownIndicator);
             await waitFor(() => {
                expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
            });
            expect(defaultTestProps.onMenuClose).toHaveBeenCalledTimes(1);
        });

        // Simulating drag requires more complex event sequences (touchstart, touchmove, touchend)
        // and checking internal state `userIsDragging`, which is harder with RTL.
        // We'll trust the logic and test the outcome (e.g., click doesn't happen after drag).
        it('should NOT trigger clear/open on touch end if dragged', async () => {
            const { getControl } = renderSelect({ isClearable: true, value: options[0], onMenuOpen: jest.fn() });
            const control = getControl();
            const clearIndicator = control.querySelector('div[class*="-clear-indicator"]')!;

            // Simulate drag on clear indicator
            fireEvent.touchStart(clearIndicator, { touches: [{ clientX: 10, clientY: 10 }] });
            fireEvent.touchMove(clearIndicator, { touches: [{ clientX: 30, clientY: 30 }] }); // Move beyond threshold
            fireEvent.touchEnd(clearIndicator);
            expect(defaultTestProps.onChange).not.toHaveBeenCalled(); // Clear shouldn't happen

             // Simulate drag on control
            fireEvent.touchStart(control, { touches: [{ clientX: 10, clientY: 10 }] });
            fireEvent.touchMove(control, { touches: [{ clientX: 30, clientY: 30 }] }); // Move beyond threshold
            fireEvent.touchEnd(control);
            expect(defaultTestProps.onMenuOpen).not.toHaveBeenCalled(); // Menu shouldn't open
        });
    });

    // --- Focus Management ---
    describe('Focus Management', () => {
      it('should call onFocus when input receives focus', async () => {
        const { user, getInput } = renderSelect({ onFocus: jest.fn() });
        await user.click(getInput()); // Or user.tab()
        expect(defaultTestProps.onFocus).toHaveBeenCalledTimes(1);
        expect(getInput()).toHaveFocus();
      });

      it('should call onBlur when input loses focus', async () => {
        const { user, getInput } = renderSelect({ onBlur: jest.fn() });
        await user.click(getInput()); // Focus
        await user.tab(); // Blur (assuming another focusable element exists)
        // Or fireEvent.blur(getInput());
        expect(defaultTestProps.onBlur).toHaveBeenCalledTimes(1);
        expect(getInput()).not.toHaveFocus();
      });

      it('should open menu on focus if openMenuOnFocus is true', async () => {
        const { user, getInput } = renderSelect({ openMenuOnFocus: true, onMenuOpen: jest.fn() });
        await user.click(getInput()); // Focus
        expect(await screen.findByRole('listbox')).toBeInTheDocument();
        expect(defaultTestProps.onMenuOpen).toHaveBeenCalledTimes(1);
      });

      it('should blur input on select if blurInputOnSelect is true', async () => {
        const { user, getControl, getInput } = renderSelect({ blurInputOnSelect: true });
        await user.click(getControl());
        const optionElement = await screen.findByText('Two');
        await user.click(optionElement);
        expect(getInput()).not.toHaveFocus();
      });

       it('should NOT blur input on select if blurInputOnSelect is false', async () => {
        const { user, getControl, getInput } = renderSelect({ blurInputOnSelect: false });
        await user.click(getControl());
        const optionElement = await screen.findByText('Two');
        await user.click(optionElement);
        expect(getInput()).toHaveFocus(); // Focus should remain
      });
    });
  });

  // --- State Management Tests ---
  describe('State Management (Controlled)', () => {
    it('should reflect controlled value prop', () => {
      const { rerender } = renderSelect({ value: options[0] });
      expect(screen.getByText('One')).toBeInTheDocument();

      rerender({ value: options[1] });
      expect(screen.getByText('Two')).toBeInTheDocument();
      expect(screen.queryByText('One')).not.toBeInTheDocument();

      rerender({ value: null });
      expect(screen.getByText(defaultProps.placeholder as string)).toBeInTheDocument();
    });

    it('should reflect controlled inputValue prop', () => {
      const { rerender, getInput } = renderSelect({ inputValue: 'ini' });
      expect(getInput()).toHaveValue('ini');

      rerender({ inputValue: 'changed' });
      expect(getInput()).toHaveValue('changed');
    });

    it('should reflect controlled menuIsOpen prop', async () => {
      const { rerender } = renderSelect({ menuIsOpen: false });
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

      rerender({ menuIsOpen: true });
      expect(await screen.findByRole('listbox')).toBeInTheDocument();

      rerender({ menuIsOpen: false });
       await waitFor(() => {
         expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
       });
    });

    it('should call onChange but not update internally when controlled', async () => {
      const onChange = jest.fn();
      const { user, getControl } = renderSelect({ value: options[0], onChange }); // Start with value 'One'
      await user.click(getControl());
      const optionTwo = await screen.findByText('Two');
      await user.click(optionTwo);

      expect(onChange).toHaveBeenCalledWith(options[1], expect.objectContaining({ action: 'select-option' }));
      // Value should NOT change in the UI because it's controlled
      expect(screen.getByText('One')).toBeInTheDocument();
      expect(screen.queryByText('Two')).not.toBeInTheDocument();
    });

     it('should call onInputChange but not update internally when controlled', async () => {
      const onInputChange = jest.fn();
      const { user, getInput } = renderSelect({ inputValue: 'hello', onInputChange });
      await user.type(getInput(), 'a');

      expect(onInputChange).toHaveBeenCalledWith('helloa', expect.objectContaining({ action: 'input-change' }));
      // Input value should NOT change in the UI because it's controlled
      expect(getInput()).toHaveValue('hello');
    });
  });

  // --- Accessibility Testing ---
  describe('Accessibility', () => {
    it('should have correct roles', async () => {
      const { user, getControl } = renderSelect();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
      await user.click(getControl());
      expect(await screen.findByRole('listbox')).toBeInTheDocument();
      expect(screen.getAllByRole('option').length).toBeGreaterThan(0);
    });

    it('should set aria-expanded correctly', async () => {
      const { user, getControl } = renderSelect();
      const input = screen.getByRole('combobox');
      expect(input).toHaveAttribute('aria-expanded', 'false');
      await user.click(getControl());
      await screen.findByRole('listbox');
      expect(input).toHaveAttribute('aria-expanded', 'true');
      await user.keyboard('{Escape}');
      expect(input).toHaveAttribute('aria-expanded', 'false');
    });

    it('should set aria-disabled when isDisabled is true', () => {
      renderSelect({ isDisabled: true });
      expect(screen.getByRole('combobox')).toBeDisabled(); // Checks for 'disabled' attribute
      // Check container class as well
      expect(screen.getByRole('combobox').closest('div[class*="-container"]')).toHaveClass('custom-prefix--is-disabled');
    });

    it('should set aria-activedescendant during keyboard navigation', async () => {
      const { user, getInput } = renderSelect();
      getInput().focus();
      const input = screen.getByRole('combobox');
      expect(input).not.toHaveAttribute('aria-activedescendant');

      await user.keyboard('{ArrowDown}'); // Focus One
      await screen.findByRole('listbox');
      expect(input).toHaveAttribute('aria-activedescendant', 'react-select-test-instance-id-option-0');

      await user.keyboard('{ArrowDown}'); // Focus Two
      expect(input).toHaveAttribute('aria-activedescendant', 'react-select-test-instance-id-option-1');

      await user.keyboard('{Escape}'); // Close menu
      expect(input).not.toHaveAttribute('aria-activedescendant');
    });

    it('should apply aria-label and aria-labelledby', () => {
        const { rerender } = renderSelect({ 'aria-label': 'My Select Label' });
        expect(screen.getByRole('combobox')).toHaveAttribute('aria-label', 'My Select Label');

        rerender({ 'aria-label': undefined, 'aria-labelledby': 'my-label-id' });
        expect(screen.getByRole('combobox')).toHaveAttribute('aria-labelledby', 'my-label-id');
    });

    it('should apply aria-invalid and aria-errormessage', () => {
        renderSelect({ 'aria-invalid': true, 'aria-errormessage': 'error-id' });
        const input = screen.getByRole('combobox');
        expect(input).toHaveAttribute('aria-invalid', 'true');
        expect(input).toHaveAttribute('aria-errormessage', 'error-id');
    });

    // Live region testing is difficult in JSDOM. We test if the component renders.
    it('should render the live region component', () => {
        renderSelect();
        expect(screen.getByTestId('mock-live-region')).toBeInTheDocument();
    });
  });

  // --- Edge Case Testing ---
  describe('Edge Cases', () => {
    it('should handle empty options array', async () => {
      const { user, getControl } = renderSelect({ options: [], noOptionsMessage: () => 'No data' });
      await user.click(getControl());
      expect(await screen.findByText('No data')).toBeInTheDocument();
      expect(screen.queryByRole('option')).not.toBeInTheDocument();
    });

    it('should not allow interactions when disabled', async () => {
      const onChange = jest.fn();
      const onMenuOpen = jest.fn();
      const { user, getControl, getInput } = renderSelect({ isDisabled: true, onChange, onMenuOpen });

      // Try clicking control
      await user.click(getControl());
      expect(onMenuOpen).not.toHaveBeenCalled();
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

      // Try focusing and typing
      getInput().focus(); // Focus might still work programmatically or via tab
      await user.keyboard('{ArrowDown}');
      expect(onMenuOpen).not.toHaveBeenCalled();

      // Try clicking clear indicator (if it were rendered)
      // (It shouldn't render when disabled, but good to double-check if logic changes)
      const clearButton = getControl().querySelector('div[class*="-clear-indicator"]');
      if (clearButton) {
          await user.click(clearButton);
          expect(onChange).not.toHaveBeenCalled();
      }
    });

    it('should handle null/undefined value correctly', () => {
      const { rerender } = renderSelect({ value: null });
      expect(screen.getByText(defaultProps.placeholder as string)).toBeInTheDocument();
      expect(document.querySelector('input[name="my-select"][type="hidden"]')).toBeNull(); // No hidden input value

      rerender({ value: undefined, name: 'my-select' });
      expect(screen.getByText(defaultProps.placeholder as string)).toBeInTheDocument();
      const hiddenInput = document.querySelector('input[name="my-select"][type="hidden"]');
      expect(hiddenInput).toBeInTheDocument();
      expect(hiddenInput).toHaveValue(''); // Empty value for null/undefined
    });

     it('should handle custom getOptionLabel/Value', async () => {
        interface CustomOption { id: number; name: string; code: string }
        const customOptions: CustomOption[] = [{ id: 1, name: 'Custom One', code: 'C1'}];
        const { user, getControl } = renderSelect({
            options: customOptions,
            getOptionLabel: (opt: CustomOption) => opt.name,
            getOptionValue: (opt: CustomOption) => opt.code,
            value: customOptions[0],
            name: 'custom-select'
        });

        // Check rendered label
        expect(screen.getByText('Custom One')).toBeInTheDocument();

        // Check hidden input value
        const hiddenInput = document.querySelector('input[name="custom-select"][type="hidden"]');
        expect(hiddenInput).toHaveValue('C1');

        // Check menu option label
        await user.click(getControl());
        expect(await screen.findByText('Custom One')).toBeInTheDocument();
    });
  });

  // --- Performance Testing (Conceptual) ---
  // Actual performance requires profiling, but we can test rendering large lists doesn't crash.
  describe('Performance Considerations', () => {
    it('should render with a large number of options without crashing', async () => {
      const largeOptions = Array.from({ length: 200 }, (_, i) => ({
        value: `value-${i}`,
        label: `Label ${i}`,
      }));
      const { user, getControl } = renderSelect({ options: largeOptions });

      await user.click(getControl());
      const listbox = await screen.findByRole('listbox');
      expect(listbox).toBeInTheDocument();
      // Check if at least some options are rendered (virtualization might hide some)
      expect(screen.getAllByRole('option').length).toBeGreaterThan(50); // Adjust based on expected rendering
      // Check first and maybe last visible option
      expect(screen.getByText('Label 0')).toBeInTheDocument();
    });
  });

  // --- Test Documentation ---
  // The describe/it blocks serve as documentation. Add comments for complex scenarios.
});
```

**Explanation and Key Points:**

1.  **Setup (`setupTests.ts`):**
    *   Imports `@testing-library/jest-dom` for useful matchers.
    *   **Mocks Browser APIs:** `scrollIntoView`, `matchMedia`, `ResizeObserver` are mocked because they don't exist or work reliably in JSDOM.
    *   **Mocks Utilities:** `isTouchCapable` and `isMobileDevice` are mocked to control test behavior (e.g., testing touch vs. non-touch defaults). `jest.requireActual` keeps other utility functions working.
    *   **Mocks Internal Components:** `MenuPlacer`, `LiveRegion`, `ScrollManager` are mocked. This is crucial for isolating the `Select` component's logic. Testing the positioning logic of `MenuPlacer` or the announcement logic of `LiveRegion` should happen in their *own* unit tests.
    *   **Coverage Ignore:** Configuration in `jest.config.js` ignores files that are typically not the focus of unit testing the main component logic (types, styles, simple re-exports, utils tested separately).

2.  **Test Structure (`Select.test.tsx`):**
    *   **Data:** Sample `options` and `groupedOptions` are defined.
    *   **`defaultTestProps`:** Common props, including mocked handlers (`onChange`, `onInputChange`, etc.), are defined to reduce repetition.
    *   **`renderSelect` Helper:** A utility function to render the component with merged props and set up `userEvent`. It also provides helpers like `getControl` and `getInput` for easier element selection.
    *   **`describe`/`it` Blocks:** Tests are grouped logically (Rendering, Menu, Interaction, State, Accessibility, Edge Cases). `it` blocks have descriptive names.
    *   **`beforeEach(jest.clearAllMocks)`:** Ensures mocks are reset between tests.

3.  **Testing Library Usage:**
    *   **`render`:** Renders the component into a virtual DOM.
    *   **`screen`:** Provides query methods (`getByRole`, `findByText`, `queryByRole`, etc.) to find elements. Use semantic roles (`combobox`, `listbox`, `option`) where possible.
    *   **`userEvent`:** (Recommended over `fireEvent` for most interactions) Simulates user actions like `click`, `type`, `keyboard`, `hover`, `tab` more realistically. Use `await` with `userEvent` methods.
    *   **`fireEvent`:** Used for specific events not fully covered by `userEvent` or when precise control is needed (like `touch*` events or `blur`).
    *   **`waitFor`:** Used when waiting for asynchronous updates to the DOM (e.g., after opening a menu, filtering options).
    *   **`act`:** Less needed with `userEvent` v14+, but might be required if state updates happen outside simulated events.
    *   **Matchers (`@testing-library/jest-dom`):** `toBeInTheDocument`, `toHaveAttribute`, `toHaveClass`, `toBeDisabled`, `toHaveValue`, `toHaveFocus`.

4.  **Key Test Areas Covered:**
    *   **Rendering:** Checks initial structure, placeholder, single/multi values, indicators, hidden inputs, disabled state, loading state, `className`/`prefix`.
    *   **Menu:** Opening/closing via clicks and keys, option rendering (flat and grouped), filtering, no options message, disabled options, `hideSelectedOptions`.
    *   **Interaction:** Keyboard navigation (arrows, enter, tab, escape, backspace, page keys, home/end), mouse clicks (select, clear, remove multi-value), hover, touch events (simulated).
    *   **State:** Controlled component behavior (props drive UI, callbacks are fired), focus/blur handling (`onFocus`, `onBlur`, `blurInputOnSelect`, `openMenuOnFocus`).
    *   **Accessibility:** Roles, `aria-*` attributes (`expanded`, `disabled`, `activedescendant`, `label`, `labelledby`, `invalid`, `errormessage`), live region rendering (basic check).
    *   **Edge Cases:** Empty options, disabled state interactions, null/undefined values, custom formatters.
    *   **Performance:** Basic check that rendering a large list doesn't crash.

5.  **Coverage:** The `jest.config.js` includes coverage settings aiming for 80%. Running `jest --coverage` will generate a report showing which lines/branches are covered. You might need to add more specific tests for conditional branches within event handlers or lifecycle methods if coverage is low.

This comprehensive suite provides high confidence in the `Select` component's functionality and adherence to its props API. Remember to adjust paths and potentially mock implementations based on your exact project structure and the behavior of internal components.

### Tokens: {'input_tokens': 18518, 'output_tokens': 15402}
### Execution time: 147.83424401283264
