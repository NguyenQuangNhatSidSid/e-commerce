import multiparty from "multiparty";
export default async function handle(req, res) {
  const form = new multiparty.Form();
  form.parse(req, async (err, fields, files) => {
    console.log("length: ", files.file.length);
    res.json("ok");
  });
}

export const config = {
  api: { bodyParse: false },
};
