# PassGen.js
A pure vanilla JavaScript class for generating strong passwords

Originally developed by: Nayuki:
https://www.nayuki.io/page/random-password-generator-javascript

## Installation

```
npm install @designly/passgen
```

## Usage
```
var PG = new PassGen({
outputCallback: function(password){
...do something with password...
}
});

PG.generate();
```
## Options

<table>
  <thead>
    <tr>
      <th>Option</th>
      <th>Description</th>
      <th>Default Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>charSets (array)</td>
      <td>Character sets to use in generation. Possible values:
        <code>["lowercase","uppercase","numbers","symbols","space"]</code></td>
      <td><code>["lowercase","uppercase","numbers","symbols"]</code></td>
    </tr>
    <tr>
      <td>length (int)</td>
      <td>Length of password to be generated. Only used when <code>lengthMethod = length</code></td>
      <td><code>10</code>
    <tr>
      <td>lengthMethod (string)</td>
      <td>Method used to determine password length. Possible values: <code>length | entropy</code></td>
      <td><code>length</code></td>
    </tr>
    <tr>
      <td>entropy (int)</td>
      <td>Size of entropy to be used to generate password (expressed in bits). Only used when <code>lengthMethod =
          entropy</code></td>
      <td><code>128</code>
    </tr>
    <tr>
      <td>errorCallback (function)</td>
      <td>Function called for handling errors. If, null, uses <code>alert()</code>. Passes: <code>message</code></td>
      <td><code>null</code></td>
    </tr>
    <tr>
      <td>outputCallback (function)</td>
      <td>Function called for handling password output. If, null, uses <code>alert()</code>. Passes: <code>password,
          stats</code></td>
      <td><code>null</code></td>
    </tr>
      <td>debugConsole (boolean)</td>
      <td>If true, password, errors and stats are printed to the console log.</td>
      <td><code>false</code></td>
    </tr>
  </tbody>
</table>

## Methods

<table>
  <thead>
    <tr>
      <th>Method</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>generate()</code></td>
      <td>Executes the generation of the password. Calls <code>outputCallback(password, stats)</code> on success.
    </tr>
    <tr>
      <td><code>copy(callback)</code></td>
      <td>Copies generated password to clipboard. Calls <code>callback(this.currentPassword)</code> on success.
    </tr>
  </tbody>
</table>