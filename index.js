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

import { asyncComponent } from 'react-async-component';

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

// const antD = {}

/**
 * 使用react高阶组件进行包装 根据model参数返回ant组件或者react-widget组件
 * model === "ant" 使用ant组件；model === "simple" || !model 使用react-widget组件
 * 未使用model属性时默认先去react-widget中寻找同名组件
 */
let IntervalEnhance = (type)  => class extends React.Component {
    constructor(props) {
        super(props);
        let isSimple = this.props.model === "simple",
            isAnt    = this.props.model === "ant";

        this.Comp = !this.props.model || !(isSimple || isAnt)
            ? RWidget[type] ? RWidget[type] : antD[type] 
            : isSimple ? RWidget[type] : antD[type];
    }
    render() {
        const Comp = this.Comp;
        return Comp ? <Comp {...this.props} /> : null
    }
}

// 同名模块
let Calendar = IntervalEnhance("Calendar"),
    Modal = IntervalEnhance("Modal"),
    Dropdown = IntervalEnhance("Dropdown"),
    AutoComplete = IntervalEnhance("AutoComplete"),
    Tree = IntervalEnhance("Tree");

// react-widget
let Grid = IntervalEnhance("Grid"),
    Validation = IntervalEnhance("Validation"),
    Validator = IntervalEnhance("Validator"),
    DateInput = IntervalEnhance("DateInput"),
    Checkboxgroup = IntervalEnhance("Checkboxgroup"),
    Radiogroup = IntervalEnhance("Radiogroup"),
    ColorInput = IntervalEnhance("ColorInput"),
    Uploader = IntervalEnhance("Uploader"),
    Dnd = IntervalEnhance("Dnd");

// antD
let Affix = IntervalEnhance("Affix"),
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

export {
    // 同名模块
    Calendar,
    Modal,
    Dropdown,
    AutoComplete,
    Tree,

    // react-widget
    Grid,
    Validation,
    Validator,
    DateInput,
    Checkboxgroup,
    Radiogroup,
    ColorInput,
    Uploader,
    Dnd,

    // antD
    Affix,
    Anchor,
    Alert,
    BackTop,
    Badge,
    Breadcrumb,
    Button,
    Card,
    Collapse,
    Carousel,
    Cascader,
    Checkbox,
    Col,
    DatePicker,
    Form,
    Icon,
    Input,
    InputNumber,
    Layout,
    LocaleProvider,
    message,
    Menu,
    notification,
    Pagination,
    Popconfirm,
    Popover,
    Progress,
    Radio,
    Rate,
    Row,
    Select,
    Slider,
    Spin,
    Steps,
    Switch,
    Table,
    Transfer,
    TreeSelect,
    Tabs,
    Tag,
    TimePicker,
    Timeline,
    Tooltip,
    Mention,
    Upload,
    version
};
