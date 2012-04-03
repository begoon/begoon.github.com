---
layout: post
title: "Visual Studio 11 Developer Preview"
language: russian
date: 2011-12-07 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2011/12/visual-studio-11-developer-preview.html
categories: 
- visual studio
- russian
---
Поставил на рабочий ноут Visual Studio 11 Developer Preview.

Погонял разные самопальные бенчмарки типа решета Эратосфена, `vector<int>` vs `vector<bool>`, `std::string` vs `char*` и т.д., пытаясь выявить улучшения или ухудшения в оптимизации. Лично я ничего кардинального не выявил по сравнению с версией 10.

Очевидно, что статический анализ кода и его безопасность в целом сейчас как никогда в моде, поэтому производители компиляторов постепенно закручивают гайки, превращая предупреждения в ошибки.

Например с ключом `/sdl` Студия 11 будет считать приведенные ниже предупреждения ошибками.

<table border="1">
<colgroup>
<col width="5%" />
<col width="13%" />
<col width="83%" />
</colgroup>
<thead valign="bottom">
<tr><th class="head">Warning</th>
<th class="head">Command line switch</th>
<th class="head">Description</th>
</tr>
</thead>
<tbody valign="top">
<tr><td><a href="http://msdn.microsoft.com/en-us/library/4kh09110.aspx">C4146</a></td>
<td>/we4146</td>
<td>A unary minus operator was applied to an unsigned type, resulting in an unsigned result</td>
</tr>
<tr><td><a href="http://msdn.microsoft.com/en-us/library/5ft2cz8d.aspx">C4308</a></td>
<td>/we4308</td>
<td>A negative integral constant converted to unsigned type, resulting in a possibly meaningless result</td>
</tr>
<tr><td><a href="http://msdn.microsoft.com/en-us/library/h6b9te7b.aspx">C4532</a></td>
<td>/we4532</td>
<td>Use of "continue", "break" or "goto" keywords in a __finally/finally block has undefined behavior during abnormal termination</td>
</tr>
<tr><td><a href="http://msdn.microsoft.com/en-us/library/f7687yks.aspx">C4533</a></td>
<td>/we4533</td>
<td>Code initializing a variable will not be executed</td>
</tr>
<tr><td><a href="http://msdn.microsoft.com/en-us/library/axhfhh6x.aspx">C4700</a></td>
<td>/we4700</td>
<td>Use of an uninitialized local variable</td>
</tr>
<tr><td><a href="http://msdn.microsoft.com/en-us/library/w0c0bww3.aspx">C4789</a></td>
<td>/we4789</td>
<td>Buffer overrun when specific C run-time (CRT) functions are used</td>
</tr>
<tr><td><a href="http://msdn.microsoft.com/en-us/library/8wsycdzs.aspx">C4995</a></td>
<td>/we4995</td>
<td>Use of a function marked with pragma deprecated</td>
</tr>
<tr><td><a href="http://msdn.microsoft.com/en-us/library/ttcz0bys.aspx">C4996</a></td>
<td>/we4996</td>
<td>Use of a function marked as deprecated</td>
</tr>
</tbody>
</table>

Ссылки по теме:

* Оригинальный пост "[Compiler Security Enhancements in Visual Studio 11][]", кратким переводом которого по сути является этот пост.

[Compiler Security Enhancements in Visual Studio 11]: http://blogs.msdn.com/b/sdl/archive/2011/12/02/security.aspx
