"use strict";var _constant=require("./constant");Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=parseParenthesisContent;/**
 * Get all the content inside brackets
 * @param {string} stringToParse string with parenthesis. This string must start with an `(`
 * @param {number} [startingPosition] to start parsing
 * @returns {{content: string, position: number}} All the content inside parenthesis including nested properties
 *
 * @todo might worth to parse the string until a `(` is found?
 */function parseParenthesisContent(stringToParse,startingPosition=0){let position=startingPosition,content="";const stack=[];for(;position!==stringToParse.length;){const mapChracter=stringToParse[position];// go ahead
if("("===mapChracter?stack.push(position):")"===mapChracter&&stack.pop(),content+=mapChracter,position++,0===stack.length)break}/**
   * String should be already validated by postcss but to avoid unclear stacktrace I'll manage the error anyway.
   */if(0!==stack.length)throw new Error(`${_constant.ERROR_PREFIX} parenthesis not closed`);return{content,position}}module.exports=exports.default;