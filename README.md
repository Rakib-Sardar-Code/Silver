# Why use Silver

When I start learning game development. I confused that which library is best for HTML5 game development I tried Pixi js, Phaser js and more. I'm looking for a simple framework that do my work easily I'm not doing any complex work just creating a simple game. And then I found HTML5 canvas, but it's not actually used for game development. WebGL or WebGL2 is used for game development because WebGL have many features that help developer to create games. But I tried to create game development framework using HTML5 canvas API.
# Setup environment
**Requirements**:

-code editor : you can use any code editor for it.(recommend : VS Code)

-browser : use any browser, but care about this

```
Chrome. 4 - 121 Supported. 123 - 125 Supported.
-
Edge * 12 - 120 Supported.
-
Safari. 3.1 - 3.2. See notes: 4 - 17.2 Supported.
-
Firefox. 2 - 3.5. See notes: 3.6 - 122 Supported.
-
Opera. 10 - 105 Supported.
-
IE. 6 - 8 supported. 9 - 10 Supported.
-
Safari on iOS * 3.2 - 17.2 Supported.
-
Samsung Internet. 4 - 22 Supported.
```

If you already have installed VS Code then you don't need to download and setup. but if you don't have installed already then download [VS Code](https://code.visualstudio.com/download).
and then after download, follow some online instructions to setup vs code.
*if you use any other code editor then don't worry you can do all this thing's there.
we recommending you VS Code, because VS Code is powerful code editor, and it give us many extension that help us when we coding. ok you can learn more about vs code from online.

# Let's started

## Creating a scene
create a folder. then open this folder in vs code,
- create a file naming "index.html"
- create another file naming "main.js"
- download silver.js file from our github repo

paste silver.js file into your project file

write this code in your "index.html" file

---index.html---
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css">
    <title>tile editor</title>
</head>
<body>
<script src="./silver.js"></script>
<script src="main.js"></script>
</body>
</html>

```
### be carefull when you linking your javascript file first of all you need to link our "silver.js" file
and after writing "index.html" you need to do something with "main.js"
write this code in your "main.js" file
---main.js---
```
var scene = new Scene(SCREEN.fit());
scene.solidShader("skyblue");
scene.Scrolloff();
scene.MKflex();

```
ok, let explain it
what we actually did in our "main.js" file

first of all we need to create a scene, where we will draw many shape and sprite later.
- we create a variable name scene where we stored our Scene class. it take 2 parameter in a array like [600,450].
- SCREEN.fit() method return your screen width and height in a array.
- scene.solidShader() method take 1 parameter the color of your scene.
- you can also use gradientShader() method for use gradient color in your scene like **scene.gradient("powderblue,wheat")**
- scene.Scrolloff() method disable scrolling bar.
- scene.MKflex() method move your scene( HTML5 Canvas Element ) to top-left corner.
 
## Draw some shapes
