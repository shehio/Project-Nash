# Game Theory
Game theory is the study of strategic interaction of rational agents. The theory was originated by [John von Neumann](https://en.wikipedia.org/wiki/John_von_Neumann) and [Oskar Morgenstern](https://en.wikipedia.org/wiki/Oskar_Morgenstern). In 1994, John Nash was awarded the Noble Memorial Prize in Economic Sciences for proving that every game has an equilibrium where no player has an incentive to change their strategy, pure or mixed. At the end of the day, Nash proved that every game has a value, a generalization of the Minimax theorem (discussed later in this file). Today, game theory is widely used in computer science, evolutionary biology, economics, and policy-making.

## Game Type
- Sequential: Games where players take turns to choose their actions like chess or backgammon.
- Simultaneous: Games where players choose their action at the same time like rock-paper-scissors or, the well-known game, prisoner's dilemma.
- Perfect Information: Games where all players have access to the history of all actions by all players like chess.

## Code
- Minimax: Algorithm that finds the value of sequential games. John von Neumann published Minimax in 1928.
- Lemke Howsen: Algorithm to compute Nash Equilibrium of a bimatrix game. Carlton E. Lemke and J. T. Howson published their [method](https://www1.cmc.edu/pages/faculty/MONeill/math188/papers/lemkehowson.pdf) in 1964. This is the [best explanation](https://youtu.be/i3Ag8Dw0LZg) I've found online.
- [Monte Carlo Tree Search](https://github.com/shehio/monte-carlo-tree-search): In recent years, MCTS has been intensively used as an approximation of Minimax for effective heuristics searching decision tree when state enumeration is infeasible in games like chess or go. Attached is a python implementation by the same author.