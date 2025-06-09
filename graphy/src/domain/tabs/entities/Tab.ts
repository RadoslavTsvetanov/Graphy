type VPromise = Promise<void>;

export interface TabInfo {
  id: number;
  windowId: number;
  url?: string;
  title?: string;
  favIconUrl?: string;
  status?: string;
  active?: boolean;
  pinned?: boolean;
  highlighted?: boolean;
  incognito?: boolean;
  width?: number;
  height?: number;
  sessionId?: string;
  openerTabId?: number;
};

export const relations = ["parent", "child"] as const;
export type TabRelation = typeof relations[number];

export interface TabQuery {
  id?: number;
  url?: string;
}
// make it into rich domain model instead of coupling the data directly to the methods for interacting with it 
/*



Perfect — if the entity is a class instead of a plain type or interface, the approach is similar but comes with a few options:
✅ Goal Recap:

    You have a bare class entity with just fields.

    You want to extend it in another class.

    The extended class adds behavior via interface implementation.

🧱 Example: Entity as a Class

// 1. Bare Entity with fields
class UserEntity {
  constructor(
    public id: string,
    public email: string,
    public verified: boolean
  ) {}
}

🧩 Interface for Behavior

interface Verifiable {
  verify(): void;
  isVerified(): boolean;
}

🚀 Class That Adds Behavior

class UserModel extends UserEntity implements Verifiable {
  constructor(entity: UserEntity) {
    super(entity.id, entity.email, entity.verified);
  }

  verify(): void {
    this.verified = true;
  }

  isVerified(): boolean {
    return this.verified;
  }
}

✅ Usage

const entity = new UserEntity("123", "test@example.com", false);
const user = new UserModel(entity);

console.log(user.isVerified()); // false
user.verify();
console.log(user.isVerified()); // true

🧠 Why This Pattern Works Well

    UserEntity: Simple, reusable, and serializable (good for database, APIs).

    UserModel: Encapsulates domain logic (e.g. verify()).

    Verifiable: Enables polymorphism or mocking in tests.

🔧 Alternative: Add More Interfaces

interface Serializable {
  toJSON(): string;
}

class UserModelV2 extends UserEntity implements Verifiable, Serializable {
  verify() {
    this.verified = true;
  }

  isVerified(): boolean {
    return this.verified;
  }

  toJSON(): string {
    return JSON.stringify(this);
  }
}

Would you like to go deeper into:

    Multiple decorators using mixins?

    Abstract base classes instead of interfaces?

    Separating persistence (e.g. for use with an ORM like TypeORM)?

You said:
now whats the name of that
ChatGPT said:

The pattern you've implemented is most commonly referred to as a Rich Domain Model or Rich Entity Pattern, often used in Domain-Driven Design (DDD).
🏷️ Official Names

Here are the most accurate terms:
✅ Rich Domain Model

    A class that encapsulates both data and behavior.

    Extends a bare entity (with fields only) to add business logic.

    Common in DDD, enterprise software, and clean architecture.

✅ Entity Inheritance + Interface Implementation

    Technically: this is class inheritance (from a data entity) combined with interface-based design (for defining behavior).

    The combo of:

        extends → inheritance of data

        implements → behavioral contracts

✅ Behavioral Decorator (Classical Inheritance Style)

    If you're wrapping a class and adding behavior, it echoes a Decorator Pattern (but not in the functional sense — more OOP-style).

🧠 When to Use These Names
Use Case	Common Name
DDD / business logic	Rich Domain Model
Simple data extension with logic	Rich Entity
Focus on behavior injection	Interface-based Design
Swappable wrappers	Decorator Pattern
Structuring service-layer logic	Domain Model Pattern
🧭 Summary for Your Case:

    You’re using a Rich Domain Model pattern, where you:

        Define a bare entity class for structure

        Extend it with a new class that adds logic

        Implement behavior via interfaces

That's a Rich Entity with Interface-based Composition, or simply:

    🔖 "Rich Domain Model via Class Inheritance and Interface Implementation"

Let me know if you want a compositional (non-inheritance) version of the same pattern — very common in functional or Go-style architectures.

*/
export interface ITab {
windowId // a bit  redundant but we want to reflect the browser taab as close as possible 
  info: TabInfo;
  history: string[];
  id: number
  addChange(change: browser.tabs._OnUpdatedChangeInfo): VPromise;
  addRelation(tab: ITab, type: TabRelation): VPromise;
  getRelations(query?: TabQuery): ITab[]; // e,g, tabs opened from it or its parents
  removeRelation(tab: ITab, type: TabRelation): VPromise;
}
