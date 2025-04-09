import Apis from "./apis";
import Content from "@/components/content";
import CreateApiButton from "./create-api-button";

export default async function ApiKeysPage() {
  return (
    <Content>
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold">Create your API keys!</h1>
          <p className="text-sm">
            You can create your API keys by clicking the button below.
          </p>
        </div>
        <CreateApiButton />
      </div>
      <Apis />
    </Content>
  );
}
