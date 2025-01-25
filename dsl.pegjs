// peggy --format globals --export-var dslParser -o dslParser.js dsl.pegjs
// Start rule: Allow whitespace before and after animations
Start
  = ws animations:animation+ ws EOF {
    return animations;
  }

// Animation rules
animation
  = objectCreation / movement / loop / ifStatement / deleteObject

objectCreation
  = name:Identifier ws "=" ws "obj.create" ws "(" x:Integer ws "," ws y:Integer ws "," ws time:Time ws "," ws image:imageReference ws ")" ws ";"? ws {
    return { type: "objectCreation", name, x, y, time, image };
  }

deleteObject
  = name:Identifier ws ".delete" ws "(" time:Time ws ")" ws ";"? ws {
    return { type: "delete", name, time };
  }

// Movement rule supporting absolute and relative coordinates
movement
  = name:Identifier ws ".move" ws "(" x:coordinate ws "," ws y:coordinate ws "," ws time:Time ws ")" ws ";"? ws {
    return { type: "movement", name, x, y, time };
  }

// If statement rule: Allows nested animations
ifStatement
  = ws "if" ws "(" condition:conditionExpression ")" ws "{" ws actions:animation+ ws "}" ws ";"? ws "else" ws "{" ws actions1:animation* ws "}" ws ";"? {
    return { type: "ifStatement", condition, actions, actions1 };
  }

// Condition expression: Supports property comparisons
conditionExpression
  = obj:Identifier ws "." ws property:Identifier ws comparator:("==" / "!=" / ">" / "<" / ">=" / "<=") ws value:Integer {
    return { obj, property, comparator, value };
  }

// Loop rule: Supports nested animations
loop
  = "Loop" ws "(" count:Integer ws "," ws obj:Identifier ws "," ws startTime:Time ws ")" ws "{" ws actions:animation+ ws "}" ws ";"? ws {
    return { type: "loop", count, obj, startTime, actions };
  }

// Coordinate rule: Supports absolute and relative coordinates
coordinate
  = sign:("+" / "-")? value:Integer {
    return sign ? [sign, value] : value;
  }

// Image reference rule: Ensures valid image identifiers
imageReference
  = [a-zA-Z_][a-zA-Z0-9_]* {
    return text();
  }

// Utility rules
Identifier
  = [a-zA-Z_][a-zA-Z0-9_]* {
    return text();
  }

Integer
  = [0-9]+ {
    return parseInt(text(), 10);
  }

Time
  = Integer "s" {
    return parseInt(text(), 10);
  }

ws
  = [ \t\n\r]*

EOF
  = !.
