var ship;
var lasers;
var powerups;
var rocks;
var stars;

var startTime;
var bestTime;

function CreateWalls() {
	var fixDef = new b2FixtureDef;
	fixDef.density = 1.0;
	fixDef.friction = 0.0;
	fixDef.restitution = 1.0;
	fixDef.shape = new b2PolygonShape;
	
	var bodyDef = new b2BodyDef;
	bodyDef.type = b2Body.b2_staticBody;
	
	bodyDef.position.x = canvas.width / 2 / SCALE;
	bodyDef.position.y = canvas.height / SCALE - 1/SCALE;
	fixDef.shape.SetAsBox((canvas.width / SCALE) / 2, (10/SCALE) / 2);
	world.CreateBody(bodyDef).CreateFixture(fixDef);
	
	bodyDef.position.x = canvas.width / 2 / SCALE;
	bodyDef.position.y = 1/SCALE;
	fixDef.shape.SetAsBox((canvas.width / SCALE) / 2, (10/SCALE) / 2);
	world.CreateBody(bodyDef).CreateFixture(fixDef);
	
	bodyDef.position.x = canvas.width / SCALE - 1/SCALE;
	bodyDef.position.y = canvas.height / 2 /SCALE;
	fixDef.shape.SetAsBox((10/SCALE) / 2, (canvas.height / SCALE) / 2);
	world.CreateBody(bodyDef).CreateFixture(fixDef);
	
	bodyDef.position.x = 1/SCALE;
	bodyDef.position.y = canvas.height / 2 / SCALE;
	fixDef.shape.SetAsBox((10/SCALE) / 2, (canvas.height / SCALE) / 2);
	world.CreateBody(bodyDef).CreateFixture(fixDef);
}


contactListener.PostSolve = function(contact, impulse) {
	var damage = 0.0;
	var other = null;
	
	if( contact.GetFixtureA().GetBody() == ship.GetBody() ) {
		other = contact.GetFixtureB().GetBody().GetUserData();
	}
	else if(contact.GetFixtureB().GetBody() == ship.GetBody() ) {
		other = contact.GetFixtureA().GetBody().GetUserData();
	}
	
	if(other != null) {
		if(other.GetType() == ROCKID) {
			damage = impulse.normalImpulses[0] * other.DeathPercentage();
			ship.Damage(damage * damage);
		}
		else if(other.GetType() == POWERUPTYPE) {
			other.PickUp();
		}
	}
}


function DestroyCurrentWorld() {
	rocks.DestroyAll();
	powerups.DestroyAll();
}

function StartNewRandomWorld() {
	DestroyCurrentWorld();
	ship.Reset();
	rocks.Create(10);
	powerups.Create(2);
	startTime = new Date();
}


function start() {
	// Create Walls
	CreateWalls();
	
	// Create Stars
	stars = new Stars;
	stars.Init(100);
	
	// Create ship
	ship = new SpaceShip;
	ship.Init();

	// Create Laser Manager
	lasers = new Lasers();
	
	// Powerups
	powerups = new Powerups();
	
	// Create rocks
	rocks = new Rocks();
	
	//Create the world
	StartNewRandomWorld();
}

function tick(dTime) {
	var curPlayTime = new Date()-startTime;
	ship.Tick(dTime);
	lasers.Tick(dTime);
	rocks.Tick(dTime);
	powerups.Tick(dTime);
	
	
	if(!ship.IsAlive()) {
		StartNewRandomWorld();
	}
	
	if(rocks.AllDestroyed()) {
		//You won
		if(bestTime != null) {
			if( curPlayTime < bestTime )
				bestTime = curPlayTime;
		}
		else {
			bestTime = curPlayTime;
		}
		
		bestTimeElement.innerHTML = "Best: " + TimeToString(bestTime);
		StartNewRandomWorld();
	}
	
	//timeElement.innerHTML = "Time: " + TimeToString(curPlayTime);
}

function draw() {
	//context.clearRect(0, 0, canvas.width, canvas.height);
	context.fillStyle='rgb(4, 15, 22)';
	context.fillRect(0, 0, canvas.width, canvas.height);

	stars.Draw();
	lasers.Draw();
	ship.Draw();
	rocks.Draw();
	powerups.Draw();
}
