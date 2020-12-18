# Regex Multi Tool

Tool for testing regular expressions and creating mini tools for modifying text with regular expressions.

*Regex multi tool* aims to merge two seperate but related tools I've been working on for years.

* __Regex Tester__ which allows you to test regular expressions, see what a regular expression captures from a given string and sequentially apply multiple find/replace patterns on a string
* __[Do regex stuff](README-do-stuff.md)__ which allows you to perform complex, __repeatable__, text transformations using regexes and programming logic. This is achieved by creating custom *actions* (a *action* is a function that allows you do do whatever you want to a string)

Both parts can run in directly in the browser using Javascript or utilise a server-side API. <br />
(Currently, only the PHP implementation is in progress. However, I hope to create one in `.Net` and maybe in Python since I've just started learning that.)

The user interface is written in pure Javascript using the [lit-html](https://lit-html.polymer-project.org/)

This is an experement to see if I can build a sophisiticated Javascript based tool without any build step.
