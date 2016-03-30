Names
=====

Data
----
Data is from the [Social Security Administration][1]. It's organized by state.
The data is loaded into ?, keyed by name.

names

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
Horizon charts

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
- router
- hover to show values
- horizon y scales broken
- sort states by total descending
- state map
- autocomplete
