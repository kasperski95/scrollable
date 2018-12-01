Component uses native browser scrolling mechanism. Default scrollbars are hidden by CSS. To
get size of default scrollbar, hidden element is created.
 
When thumb was dragged, browser was changing cursor. To prevent that, the
component uses fake drag system (mouseDown, mouseMove, mouseUp). Dragging is
recreated with help of Dummy elements. When event 'mousedown' is fired, the
dummy element covers whole screen.


## Known issues:
- Mobile browsers: Default scrollbars are visible and width of component is incorrect. This package will be ignoring mobile browsers in the future. Instead it will try to modify default scrollbars as much as possible.
- IE Explorer / Edge: Dragging is not working. Browsers don't support method: *scrollBy*.
- During dragging, if cursor is over other and younger scrollbar, dragging is interrupted.
- If mouse wheel event is fired over the dummy element, scrolling is done by script and scrolling is not smooth.


## [Demo](http://visperfect.com/npm/scrollable)


## Example
```
import Scrollable from 'kas-scrollable'

export default class Demo extends Component {
    render() {
        <Scrollable
            height="500"
            thumbColor="red">
            Lorem ipsum...
        </Scrollable>
    }
}
```
## Properties
- width="300" *(in px. If not set, 100%)*
- height="300" *(in px. If not set, 100%)*
- thumbColor="rgba(0, 0, 0, 0.25)"
- thumbDragColor="rgba(0, 0, 0, 0.5)"
- thumbHoverColor="rgba(0, 0, 0, 0.75)"
- trackColor="rgba(0, 0, 0, 0)"
- trackDragColor="rgba(0, 0, 0, 0)"
- trackHoverColor="rgba(0, 0, 0, 0)"
- dummySize="8"
- showDummy="false"
- size="4"
- radius="4"
- longitudinalOffset="2"
- disableAutoHide="false"
- transitionTime="0.1s"

## Misc
- Import and use *ScrollableBright* for dark themes.
    ```
        import {ScrollableBright} from 'kas-scrollable'
    ```
- During dragging, class *drag* is added to *ScrollbarWrapper*.