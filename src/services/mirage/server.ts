import { Server, Response, Model, belongsTo, hasMany, Factory } from "miragejs";
import { login, signup } from "./routes/user";
import { create, updateDiary, getUserDiaries } from "./routes/diary";
import { createEntry, updateEntry, getEntriesByDiaries } from "./routes/entry";

export const handleErrors = (error: any, message = "An Error Ocurred") => {
  return (
    new Response(400, undefined),
    {
      data: {
        message,
        isError: true,
      },
    }
  );
};

export const setupServer = (env?: string): Server => {
  return new Server({
    environment: env ?? "development",

    models: {
      entry: Model.extend({
        diary: belongsTo(),
      }),
      diary: Model.extend({
        entry: hasMany(),
        user: belongsTo(),
      }),
      user: Model.extend({
        diary: hasMany(),
      }),
    },
    factories: {
      user: Factory.extend({
        username: "test",
        password: "password",
        email: "test@email.com",
      }),
    },
    seeds: (server): any => {
      server.create("user");
    },
    routes(): void {
      this.urlPrefix = "https://diaries.app";
      this.namespace = "api";

      this.post("/auth/login", login);
      this.post("/auth/signup", signup);

      this.post("/diary/store", create);
      this.put("/diary/update/:id", updateDiary);
      this.get("/diaries/:id", getUserDiaries);

      this.post("/enrty/store", createEntry);
      this.put("/entry/update/:id", updateEntry);
      this.get("/entries/:id", getEntriesByDiaries);
    },
  });
};
