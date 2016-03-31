Names
=====

Data
----
Data is from the [Social Security Administration][1]. It's organized by state.

name | gender | state | year | count
-----+--------+-------+------+------
Loki | M      | AZ    | 2013 | 6
Loki | M      | CO    | 2014 | 5
Loki | M      | CA    | 2008 | 8
Loki | M      | CA    | 2009 | 6
...

index: name, state, year

[1]: https://www.ssa.gov/oact/babynames/limits.html

Visualization
-------------
[Horizon charts][2]

[2]: http://bl.ocks.org/mbostock/1483226

State
-----
```javascript
{
  newName: null,
  names: [
    { name, expanded, counts }
  ],

  extents: []
}
```

TODO
----
- hover to show values
- horizon y scales broken
- sort states by total descending
- state map
- autocomplete
