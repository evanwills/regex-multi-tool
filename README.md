# Regex Multi Tool

## Getting started

Download from Github https://github.com/evanwills/regex-multi-tool

```sh
$ npm install
$ npm run dev
```

## About

This is a tool for testing regular expressions and creating mini tools for repeatedly, programtically modifying text with the help of regular expressions.

*Regex multi tool* aims to merge two seperate but related tools I've been working on for years.

* __[Regex Tester](README-oneOff.md)__ which allows you to test regular expressions, see what a regular expression captures from a given string and sequentially apply multiple find/replace patterns on a string
* __[Do regex stuff](README-repeatable.md)__ which allows you to perform complex, __repeatable__, text transformations using regexes and programming logic. This is achieved by creating custom *actions* (an *action* is a function that allows you do do whatever you want to a string)

Both parts can run in directly in the browser using Javascript or utilise a server-side API. <br />
(Currently, only the PHP implementation is in progress. However, I hope to create one in `DotNet` and maybe in Python since I've just started learning that.)

The user interface is written in pure Javascript using the [lit-html](https://lit-html.polymer-project.org/)

This is an experement to see if I can build a sophisiticated Javascript based tool without any build step.

# TODO

* ~~Dark mode theme~~ _[done]_
* ~~Light mode theme~~ _[done]_
* ~~User managed custom theme~~ _[done]_
* ~~browser history updating~~ _[done]_
* ~~Remove dependence on Sass~~ _[done]_
* ~~Local "Repeatable" implementation~~ _[done]_
* Export Regex API (TypeScript) to ES Modules _[in progress]_
* Implement Local storage _[mostly done]_
* Implement Service worker
* Make all actions that modify text asynchronous
* Remote Regex test (oneOff)
* Remote Do Regex stuff (repeatable)
* Move local actions that modify text into a web worker (if that's even possible)
* Move state management to web worker
