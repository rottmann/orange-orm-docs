# What it is not

## It is not about migrations

The allure of ORMs handling SQL migrations is undeniably attractive and sweet. However, this sweetness can become painful. Auto-generated migration scripts might not capture all nuances. Using dedicated migration tools separate from the ORM or manually managing migrations might be the less painful route in the long run.  <span v-html="$projectName"></span> aim for database agnosticism. And when you're dealing with migrations, you might want to use features specific to a database platform. However, I might consider adding support for (non-auto-generated) migrations at a later point. But for now, it is not on the roadmap.

## It is not about NoSql databases

Applying ORMs to NoSQL, which inherently diverges from the relational model, can lead to data representation mismatches and a loss of specialized NoSQL features. Moreover, the added ORM layer can introduce performance inefficiencies, complicate debugging, and increase maintenance concerns. Given the unique capabilities of each NoSQL system, crafting custom data access solutions tailored to specific needs often provides better results than a generalized ORM approach.

## It is not about GraphQL

<span v-html="$projectName"></span>, already supports remote data operations via HTTP, eliminating the primary need for integrating GraphQL. <span v-html="$projectName"></span>'s built-in safety mechanisms and tailored optimization layers ensure secure and efficient data operations, which might be compromised by adding GraphQL. Furthermore, <span v-html="$projectName"></span>'s inherent expressivity and powerful querying capabilities could be overshadowed by the introduction of GraphQL. Integrating GraphQL could introduce unnecessary complexity, potential performance overhead, and maintenance challenges, especially as both systems continue to evolve. Therefore, considering <span v-html="$projectName"></span>'s robust features and design, supporting GraphQL might not offer sufficient advantages to warrant the associated complications.
