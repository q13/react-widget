/**
 * Component collection
 */
import React from "react";
import RwGrid from "./src/component/grid";
import RwValidation from "./src/component/validation";
import RwValidator from "./src/component/validator";
import RwCalendar from "./src/component/calendar";
import RwDateInput from "./src/component/form/DateInput.js";
import RwModal from "./src/component/modal";
import RwCheckboxgroup from "./src/component/form/Checkboxgroup";
import RwRadiogroup from "./src/component/form/Radiogroup";
import RwDropdown from "./src/component/form/Dropdown";
import RwAutoComplete from "./src/component/autocomplete";
import RwColorInput from "./src/component/form/ColorInput.js";
import RwUploader from "./src/component/uploader";
import RwTree from "./src/component/tree";
import RwDnd from "./src/component/dnd";

import {
    Affix as AntAffix,
    Anchor as AntAnchor,
    AutoComplete as AntAutoComplete,
    Alert as AntAlert,
    BackTop as AntBackTop,
    Badge as AntBadge,
    Breadcrumb as AntBreadcrumb,
    Button as AntButton,
    Calendar as AntCalendar,
    Card as AntCard,
    Collapse as AntCollapse,
    Carousel as AntCarousel,
    Cascader as AntCascader,
    Checkbox as AntCheckbox,
    Col as AntCol,
    DatePicker as AntDatePicker,
    Dropdown as AntDropdown,
    Form as AntForm,
    Icon as AntIcon,
    Input as AntInput,
    InputNumber as AntInputNumber,
    Layout as AntLayout,
    LocaleProvider as AntLocaleProvider,
    message as Antmessage,
    Menu as AntMenu,
    Modal as AntModal,
    notification as Antnotification,
    Notation as AntNotation,
    Pagination as AntPagination,
    Popconfirm as AntPopconfirm,
    Popover as AntPopover,
    Progress as AntProgress,
    Radio as AntRadio,
    Rate as AntRate,
    Row as AntRow,
    Select as AntSelect,
    Slider as AntSlider,
    Spin as AntSpin,
    Steps as AntSteps,
    Switch as AntSwitch,
    Table as AntTable,
    Transfer as AntTransfer,
    Tree as AntTree,
    TreeSelect as AntTreeSelect,
    Tabs as AntTabs,
    Tag as AntTag,
    TimePicker as AntTimePicker,
    Timeline as AntTimeline,
    Tooltip as AntTooltip,
    Mention as AntMention,
    Upload as AntUpload,
    version as Antversion	
} from "antd";


const RWidget = {
    Grid:RwGrid,
    Validation:RwValidation,
    Validator:RwValidator,
    Calendar:RwCalendar,
    DateInput:RwDateInput,
    Modal:RwModal,
    Checkboxgroup:RwCheckboxgroup,
    Radiogroup:RwRadiogroup,
    Dropdown:RwDropdown,
    AutoComplete:RwAutoComplete,
    ColorInput:RwColorInput,
    Uploader:RwUploader,
    Tree:RwTree,
    Dnd:RwDnd
};

const antD = {
    Affix: AntAffix,
    Anchor: AntAnchor,
    AutoComplete: AntAutoComplete,
    Alert: AntAlert,
    BackTop: AntBackTop,
    Badge: AntBadge,
    Breadcrumb: AntBreadcrumb,
    Button: AntButton,
    Calendar: AntCalendar,
    Card: AntCard,
    Collapse: AntCollapse,
    Carousel: AntCarousel,
    Cascader: AntCascader,
    Checkbox: AntCheckbox,
    Col: AntCol,
    DatePicker: AntDatePicker,
    Dropdown: AntDropdown,
    Form: AntForm,
    Icon: AntIcon,
    Input: AntInput,
    InputNumber: AntInputNumber,
    Layout: AntLayout,
    LocaleProvider: AntLocaleProvider,
    message: Antmessage,
    Menu: AntMenu,
    Modal: AntModal,
    notification: Antnotification,
    Notation:AntNotation,
    Pagination: AntPagination,
    Popconfirm: AntPopconfirm,
    Popover: AntPopover,
    Progress: AntProgress,
    Radio: AntRadio,
    Rate: AntRate,
    Row: AntRow,
    Select: AntSelect,
    Slider: AntSlider,
    Spin: AntSpin,
    Steps: AntSteps,
    Switch: AntSwitch,
    Table: AntTable,
    Transfer: AntTransfer,
    Tree: AntTree,
    TreeSelect: AntTreeSelect,
    Tabs: AntTabs,
    Tag: AntTag,
    TimePicker: AntTimePicker,
    Timeline: AntTimeline,
    Tooltip: AntTooltip,
    Mention: AntMention,
    Upload: AntUpload,
    version: Antversion
}

/**
 * 使用react高阶组件进行包装 根据model参数返回ant组件或者react-widget组件
 * model === "ant" 使用ant组件；model === "simple" || !model 使用react-widget组件
 * 未使用model属性时默认先去react-widget中寻找同名组件
 */
let IntervalEnhance = (type)  => (props) =>  {
    let isSimple = props.model === "simple",
        isAnt    = props.model === "ant";

    const Comp = !props.model || !(isSimple || isAnt)
        ? RWidget[type] ? RWidget[type] : antD[type] 
        : isSimple ? RWidget[type] : antD[type];
    return Comp ? <Comp {...props} ></Comp> : null
}

// 同名模块
export let Calendar = IntervalEnhance("Calendar"),
    Modal = IntervalEnhance("Modal"),
    Dropdown = IntervalEnhance("Dropdown"),
    AutoComplete = IntervalEnhance("AutoComplete"),
    Tree = IntervalEnhance("Tree");

// react-widget
export let Grid = IntervalEnhance("Grid"),
    Validation = IntervalEnhance("Validation"),
    Validator = IntervalEnhance("Validator"),
    DateInput = IntervalEnhance("DateInput"),
    Checkboxgroup = IntervalEnhance("Checkboxgroup"),
    Radiogroup = IntervalEnhance("Radiogroup"),
    ColorInput = IntervalEnhance("ColorInput"),
    Uploader = IntervalEnhance("Uploader"),
    Dnd = IntervalEnhance("Dnd");

// antD
export let Affix = IntervalEnhance("Affix"),
    Anchor = IntervalEnhance("Anchor"),
    Alert = IntervalEnhance("Alert"),
    BackTop = IntervalEnhance("BackTop"),
    Badge = IntervalEnhance("Badge"),
    Breadcrumb = IntervalEnhance("Breadcrumb"),
    Button = IntervalEnhance("Button"),
    Card = IntervalEnhance("Card"),
    Collapse = IntervalEnhance("Collapse"),
    Carousel = IntervalEnhance("Carousel"),
    Cascader = IntervalEnhance("Cascader"),
    Checkbox = IntervalEnhance("Checkbox"),
    Col = IntervalEnhance("Col"),
    DatePicker = IntervalEnhance("DatePicker"),
    Form = IntervalEnhance("Form"),
    Icon = IntervalEnhance("Icon"),
    Input = IntervalEnhance("Input"),
    InputNumber = IntervalEnhance("InputNumber"),
    Layout = IntervalEnhance("Layout"),
    LocaleProvider = IntervalEnhance("LocaleProvider"),
    message = IntervalEnhance("message"),
    Menu = IntervalEnhance("Menu"),
    notification = IntervalEnhance("notification"),
    Pagination = IntervalEnhance("Pagination"),
    Popconfirm = IntervalEnhance("Popconfirm"),
    Popover = IntervalEnhance("Popover"),
    Progress = IntervalEnhance("Progress"),
    Radio = IntervalEnhance("Radio"),
    Rate = IntervalEnhance("Rate"),
    Row = IntervalEnhance("Row"),
    Select = IntervalEnhance("Select"),
    Slider = IntervalEnhance("Slider"),
    Spin = IntervalEnhance("Spin"),
    Steps = IntervalEnhance("Steps"),
    Switch = IntervalEnhance("Switch"),
    Table = IntervalEnhance("Table"),
    Transfer = IntervalEnhance("Transfer"),
    TreeSelect = IntervalEnhance("TreeSelect"),
    Tabs = IntervalEnhance("Tabs"),
    Tag = IntervalEnhance("Tag"),
    TimePicker = IntervalEnhance("TimePicker"),
    Timeline = IntervalEnhance("Timeline"),
    Tooltip = IntervalEnhance("Tooltip"),
    Mention = IntervalEnhance("Mention"),
    Upload = IntervalEnhance("Upload"),
    version = IntervalEnhance("version");

// widget属性
Checkboxgroup.getOptionClass = RwCheckboxgroup.getOptionClass;
Dropdown.activeInstanceId = RwDropdown.activeInstanceId;
Dropdown.renderPanel = RwDropdown.renderPanel;
Dropdown.instanceId = RwDropdown.instanceId;
Dropdown.getPanelStyle = RwDropdown.getPanelStyle;
Dropdown.isInContainer = RwDropdown.isInContainer;
Dropdown.scrollToSelectedItem = RwDropdown.scrollToSelectedItem;
Radiogroup.getOptionClass = RwRadiogroup.getOptionClass;
Modal.ajustModalZIndex = RwModal.ajustModalZIndex;
Modal.BASE_Z_INDEX = RwModal.BASE_Z_INDEX;
Tree.getCheckboxTextFromStatus = RwTree.getCheckboxTextFromStatus;
Tree.getFoldderTextFromStatus = RwTree.getFoldderTextFromStatus;
Tree.getCloneOptions = RwTree.getCloneOptions;
Tree.getOptionFromValue = RwTree.getOptionFromValue;
Uploader.isSupportFileApi = RwUploader.isSupportFileApi;
Validation.defaultRule = RwValidation.defaultRule;
Validator.defaultRule = RwValidator.defaultRule;
Validator.getNewFields = RwValidator.getNewFields;
Validator.getOrderFields = RwValidator.getOrderFields;
Validator.getStandardField = RwValidator.getStandardField;
// antD属性
Dropdown.Item = AntDropdown.Item;
Menu.Divider = AntMenu.Divider;
Menu.Item = AntMenu.Item;
Menu.SubMenu = AntMenu.SubMenu;
Menu.ItemGroup = AntMenu.ItemGroup;
Anchor.Link = AntAnchor.Link;
AutoComplete.Option = AntAutoComplete.Option;
AutoComplete.OptGroup = AntAutoComplete.OptGroup;
Breadcrumb.Item = AntBreadcrumb.Item;
Collapse.Panel = AntCollapse.Panel;
Dropdown.Button = AntDropdown.Button;
Input.Group = AntInput.Group;
Input.Search = AntInput.Search;
Layout.Sider = AntLayout.Sider;
Mention.getMentions = AntMention.getMentions;
Mention.Nav = AntMention.Nav;
Mention.toString = AntMention.toString;
Mention.toContentState = AntMention.toEditorState;
Notation.warn = AntNotation.warn;
Select.Option = AntSelect.Option;
Select.OptGroup = AntSelect.OptGroup;
Steps.Step = AntSteps.Step;
Tag.CheckableTag = AntTag.CheckableTag;
Timeline.Item = AntTimeline.Item;
Transfer.List = AntTransfer.List;
Transfer.Operation = AntTransfer.Operation;
Transfer.Search = AntTransfer.Search;
Tree.TreeNode = AntTree.TreeNode;
TreeSelect.TreeNode = AntTreeSelect.TreeNode;
TreeSelect.SHOW_ALL = AntTreeSelect.SHOW_ALL;
TreeSelect.SHOW_PARENT = AntTreeSelect.SHOW_PARENT;
TreeSelect.SHOW_CHILD = AntTreeSelect.SHOW_CHILD;
Upload.Dragger = AntUpload.Dragger;