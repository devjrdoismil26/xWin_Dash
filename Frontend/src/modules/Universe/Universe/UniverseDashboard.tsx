import React, { useEffect, useState } from "react";
import { universeApi } from '@/api/universe';
import { useUniverseStore } from '@/stores/universeStore';
import type { UniverseInstance } from "@/types/universe";

export const UniverseDashboard: React.FC = () => {
  const { instances, setInstances, setLoading, isLoading } = useUniverseStore();

  const [stats, setStats] = useState({ total: 0, active: 0 });

  useEffect(() => {
    loadInstances();

  }, []);

  const loadInstances = async () => {
    setLoading(true);

    try {
      const { data } = await universeApi.getInstances();

      setInstances(data.data);

      setStats({
        total: (data as any).data.length,
        active: (data as any).data.filter((i: UniverseInstance) => i.is_active).length,
      });

    } catch (error) {
    } finally {
      setLoading(false);

    } ;

  const handleCreateInstance = async () => {
    try {
      await universeApi.createInstance({ name: "New Universe" });

      loadInstances();

    } catch (error) {
    } ;

  if (isLoading) return <div>Loading...</div>;

  return (
            <div className=" ">$2</div><div className=" ">$2</div><h1 className="text-3xl font-bold">Universe Dashboard</h1></div><div className=" ">$2</div><div className=" ">$2</div><h3 className="text-gray-500">Total Instances</h3>
          <p className="text-2xl font-bold">{stats.total}</p></div><div className=" ">$2</div><h3 className="text-gray-500">Active</h3>
          <p className="text-2xl font-bold">{stats.active}</p></div><div className=" ">$2</div><button
            onClick={ handleCreateInstance }
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" />
            + New Instance
          </button></div><div className=" ">$2</div><div className=" ">$2</div><h2 className="text-xl font-semibold">Your Instances</h2></div><div className="{instances.length === 0 ? (">$2</div>
            <p className="text-gray-500" />
              No instances yet. Create one to get started!
            </p>
          ) : (
            <div className="{instances.map((instance: unknown) => (">$2</div>
                <div
                  key={ instance.id }
                  className="border p-3 rounded hover:bg-gray-50">
           
        </div><h3 className="font-semibold">{instance.name}</h3>
                  <p className="text-sm text-gray-500" />
                    {instance.description}
                  </p>
                  <div className=" ">$2</div><span
                      className={`text-xs px-2 py-1 rounded ${instance.is_active ? "bg-green-100 text-green-800" : "bg-gray-100"} `}>
           
        </span>{instance.is_active ? "Active" : "Inactive"}
                    </span>
      </div>
    </>
  ))}
            </div>
          )}
        </div>
    </div>);};
