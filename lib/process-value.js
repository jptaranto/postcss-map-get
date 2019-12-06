"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=_default;var _constant=require("./constant"),_parseParenthesisContent=_interopRequireDefault(require("./parse-parenthesis-content"));/**
 * @param {string} mapString SASS map string without opening parenthesis
 * @param {string} keyParameter the key to extract from the map
 * @returns {?string} retrieved `keyParameter` value from the map
 */function getKeyFromMapString(mapString,keyParameter){// remove all whitespace character from the key
const keyValue=keyParameter.replace(/\s/g,"");// remove open and close parenthesis from the map string
mapString=mapString.slice(1,-1),mapString=mapString.replace(/(\r\n|\n|\r)/gm,"");let isParsingKey=!0,hasFinishedParsingValue=!1,key="",value="";for(let position=0;position<mapString.length;position++){const currentCharacter=mapString[position];// process the key (add all characters until find a `:`)
if(isParsingKey){":"===currentCharacter?isParsingKey=!1:key+=currentCharacter;continue}if("("===currentCharacter){// if value contains a `(` that means that is map so parse the string until the `(` is closed
const output=(0,_parseParenthesisContent.default)(mapString,position);value+=output.content,position=output.position,hasFinishedParsingValue=!0}else{// simple map with property / value pairs
const isLastCharacter=position===mapString.length-1;","===currentCharacter||isLastCharacter?(isLastCharacter&&(value+=currentCharacter),hasFinishedParsingValue=!0):value+=currentCharacter}if(hasFinishedParsingValue){if(key=key.replace(/\s/g,""),key===keyValue)return value.trim();// value declaration is complete return to check key and reset both variables
isParsingKey=!0,hasFinishedParsingValue=!1,key="",value=""}}throw new Error(`${_constant.ERROR_PREFIX} unable to find “${keyValue}“ key inside map “(${mapString})“`)}/**
 * @param {string} value CSS property value including map-get invocation
 * @returns {string} value of css property resolved by map-get
 */function _default(value){let resolvedValue=value,indexOfMethod=resolvedValue.indexOf(_constant.METHOD);// start to resolve map-get more nested
for(;-1<indexOfMethod;){const startPosition=indexOfMethod;let position=startPosition+_constant.METHOD.length-1,mapString="";// resolve map content
const output=(0,_parseParenthesisContent.default)(resolvedValue,position);mapString+=output.content,position=output.position;// resolve the desidered requested key
let keyString="",hasFoundComa=!1;// indicates if we found the come which separate map and requested key:
// map-get((...) !default, bar)
//                       ↑
for(;position<resolvedValue.length;position++){const currentCharacter=resolvedValue[position];if(","===currentCharacter)hasFoundComa=!0;else if(")"===currentCharacter)break;else hasFoundComa&&(keyString+=currentCharacter)}// get the original invocation string
position++;// Include last closing parenthesis
const currentDeclaration=resolvedValue.slice(startPosition,position),mapResolvedValue=getKeyFromMapString(mapString,keyString);// replace the value string with the resolved value
// check if property value contains another map-get invocation
resolvedValue=resolvedValue.replace(currentDeclaration,mapResolvedValue),indexOfMethod=resolvedValue.indexOf(_constant.METHOD)}return resolvedValue}module.exports=exports.default;