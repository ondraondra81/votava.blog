---
date: 2018-11-07T12:50:15.869Z
title: Jak obnovit smazaný stash
featuredImage: /images/git.png
---
Už se Vám někdy stalo, že jste si smazali omylem git stash? \
Ne? Mě dneska ano. A málem mě trefilo! 

Nevěděl jsem totiž, že: `git reset --hard` smaže právě i **stash**e

<!-- end -->

Naštěstí jsem ale našel řešení a zachránil tak půldenní práci :)

Nejdříve je potřeba najít onen smazaný commit. 
```bash
git log --graph --oneline --decorate $(git fsck --no-reflogs | awk '/dangling commit/ {print $3}')
```

po té co jsem ho našli potřebujeme jeho celý hash
```bash
# 8d0bb3ce -> nahraďte za váš zkrácený commit identifier :)
git show 8d0bb3ce
```
po té co jsem zkontolovali, že je to skutečně ten commit/stash co jsme hledali najdeme nahoře celé sha

```bash
commit 8d0bb3cee1d14f01d789a252cbdf8f1115e69a53 (refs/stash)
```

a obnovíme :)

```bash
git stash apply 8d0bb3cee1d14f01d789a252cbdf8f1115e69a53
```

Uff. A je to :)

