# pex-sys

System and platform specific utilities for the pex library


## Short API

##### Event
##### EventDispatcher
##### Keyboard
##### KeyboardEvent
##### Mouse
##### MouseEvent
##### ResourceLoader
##### Screen
##### Time
##### Window
##### WindowBrowser
##### WindowPlask

## API

### Event

- `#copy()`
- `#getSender()`
- `#getType()`
- `#setSender()`
- `#stopPropagation()`

### EventDispatcher
- `#addEventListener()`
- `#dispatchEvent()`
- `#hasEventListener()`
- `#removeAllEventListeners()`
- `#removeEventListener()`

### Keyboard

- `#handleKeyDown(e)`
- `#handleKeyPress(e)`
- `#handleKeyUp(e)`

### KeyboardEvent
- `new KeyboardEvent(type, data)`
- `.KEY_DOWN`
- `.KEY_PRESS`
- `.KEY_UP`
- `.VK_BACKSPACE`
- `.VK_DELETE`
- `.VK_DOWN`
- `.VK_ENTER`
- `.VK_ESC`
- `.VK_LEFT`
- `.VK_RIGHT`
- `.VK_SPACE`
- `.VK_TAB`
- `.VK_UP`

### Mouse
- `new Mouse()`
- `#getPosX()`
- `#getPosY()`
- `#getPos()`
- `#getPrevPosX()`
- `#getPrevPosY()`
- `#getPrevPos()`
- `#getDeltaX()`
- `#getDeltaY()`
- `#getDelta()`
- `#handleMouseDown(e)`
- `#handleMouseUp(e)`
- `#handleMouseMove(e)`
- `#handleMouseScroll(e)`

### MouseEvent
- `.MOUSE_DOWN`
- `.MOUSE_DRAG`
- `.MOUSE_MOVE`
- `.MOUSE_SCROLL`
- `.MOUSE_UP`

### ResourceLoader
- `.load()`

### Screen
- `.getDevicePixelRatio()`
- `.getHeight()`
- `.getNumScreens()`
- `.getWidth()`

### Time
- `#_restart()`
- `#_resume()`
- `#_stop()`
- `#_update()`
- `#getDelta()`
- `#getDeltaSeconds()`
- `#getElapsedFrames()`
- `#getElapsedSeconds()`
- `#getFPS()`

### Window
- `.create()`
- `#addEventListener()`
- `#getAspectRatio()`
- `#getBounds()`
- `#getContext()`
- `#getHeight()`
- `#getKeyboard()`
- `#getMouse()`
- `#getResources()`
- `#getSize()`
- `#getTime()`
- `#getWidth()`

### WindowBrowser

### WindowPlask
