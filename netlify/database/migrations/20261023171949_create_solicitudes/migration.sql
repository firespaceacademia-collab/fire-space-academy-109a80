CREATE TABLE "solicitudes" (
	"id" serial PRIMARY KEY,
	"codigo" text NOT NULL UNIQUE,
	"nombre" text NOT NULL,
	"nombre_clave" text NOT NULL UNIQUE,
	"edad_on" integer NOT NULL,
	"edad_off" text NOT NULL,
	"inteligencia" text NOT NULL,
	"ocupacion" text NOT NULL,
	"talentos" text NOT NULL,
	"estado" text DEFAULT 'en_proceso' NOT NULL,
	"rechazada_en" timestamp with time zone,
	"creada_en" timestamp with time zone DEFAULT now() NOT NULL
);
