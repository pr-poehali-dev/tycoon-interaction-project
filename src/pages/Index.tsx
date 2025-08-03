import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Player {
  id: number;
  name: string;
  money: number;
  buildings: Building[];
  isActive: boolean;
  color: string;
}

interface Building {
  id: string;
  name: string;
  type: 'factory' | 'mill' | 'plant' | 'mine' | 'refinery';
  level: number;
  production: number;
  cost: number;
  income: number;
  image: string;
}

const buildingTypes: Building[] = [
  {
    id: 'steel_mill',
    name: 'Сталелитейный завод',
    type: 'mill',
    level: 1,
    production: 50,
    cost: 1000,
    income: 25,
    image: '🏭'
  },
  {
    id: 'oil_refinery',
    name: 'Нефтеперерабатывающий завод',
    type: 'refinery',
    level: 1,
    production: 75,
    cost: 2500,
    income: 45,
    image: '🛢️'
  },
  {
    id: 'auto_factory',
    name: 'Автомобильный завод',
    type: 'factory',
    level: 1,
    production: 30,
    cost: 5000,
    income: 80,
    image: '🚗'
  },
  {
    id: 'tech_plant',
    name: 'Технологический комплекс',
    type: 'plant',
    level: 1,
    production: 100,
    cost: 10000,
    income: 120,
    image: '💻'
  },
  {
    id: 'mining_complex',
    name: 'Горнодобывающий комплекс',
    type: 'mine',
    level: 1,
    production: 40,
    cost: 3000,
    income: 35,
    image: '⛏️'
  }
];

export default function Index() {
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: 'Игрок 1', money: 2000, buildings: [], isActive: true, color: 'tycoon-orange' },
    { id: 2, name: 'Игрок 2', money: 2000, buildings: [], isActive: false, color: 'tycoon-turquoise' },
    { id: 3, name: 'Игрок 3', money: 2000, buildings: [], isActive: false, color: 'tycoon-blue' },
    { id: 4, name: 'Игрок 4', money: 2000, buildings: [], isActive: false, color: 'tycoon-green' },
    { id: 5, name: 'Игрок 5', money: 2000, buildings: [], isActive: false, color: 'tycoon-yellow' }
  ]);
  
  const [selectedPlayer, setSelectedPlayer] = useState<number>(1);
  const [gameTime, setGameTime] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setGameTime(prev => prev + 1);
      
      setPlayers(prevPlayers => 
        prevPlayers.map(player => ({
          ...player,
          money: player.money + player.buildings.reduce((total, building) => total + building.income, 0)
        }))
      );
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  const joinGame = (playerId: number) => {
    setPlayers(prev => 
      prev.map(player => 
        player.id === playerId 
          ? { ...player, isActive: true, name: `Игрок ${playerId}` }
          : player
      )
    );
  };

  const buildBuilding = (playerId: number, building: Building) => {
    setPlayers(prev => 
      prev.map(player => {
        if (player.id === playerId && player.money >= building.cost) {
          const existingBuilding = player.buildings.find(b => b.id === building.id);
          if (existingBuilding) {
            return {
              ...player,
              money: player.money - building.cost * existingBuilding.level,
              buildings: player.buildings.map(b => 
                b.id === building.id 
                  ? { ...b, level: b.level + 1, income: b.income + building.income }
                  : b
              )
            };
          } else {
            return {
              ...player,
              money: player.money - building.cost,
              buildings: [...player.buildings, { ...building }]
            };
          }
        }
        return player;
      })
    );
  };

  const currentPlayer = players.find(p => p.id === selectedPlayer);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-white mb-4 font-['Oswald'] tracking-wider">
            MULTIPLAYER TYCOON
          </h1>
          <p className="text-xl text-gray-300 font-['Open_Sans']">
            Построй свою промышленную империю
          </p>
          <div className="mt-4 flex justify-center items-center gap-4">
            <div className="flex items-center gap-2 text-tycoon-turquoise">
              <Icon name="Clock" size={20} />
              <span className="font-mono text-lg">{Math.floor(gameTime / 60)}:{(gameTime % 60).toString().padStart(2, '0')}</span>
            </div>
            <div className="flex items-center gap-2 text-tycoon-yellow">
              <Icon name="Users" size={20} />
              <span>{players.filter(p => p.isActive).length}/5 игроков</span>
            </div>
          </div>
        </div>

        {/* Players Panel */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          {players.map((player) => (
            <Card 
              key={player.id}
              className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                selectedPlayer === player.id 
                  ? `ring-2 ring-${player.color} bg-slate-800` 
                  : 'bg-slate-700/50'
              } ${player.isActive ? 'animate-pulse-glow' : 'opacity-60'}`}
              onClick={() => setSelectedPlayer(player.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className={`text-${player.color} text-sm font-['Oswald']`}>
                    {player.name}
                  </CardTitle>
                  {!player.isActive && (
                    <Button 
                      size="sm" 
                      className="bg-tycoon-orange hover:bg-tycoon-orange/80"
                      onClick={(e) => {
                        e.stopPropagation();
                        joinGame(player.id);
                      }}
                    >
                      Играть
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-tycoon-yellow">
                    <Icon name="DollarSign" size={16} />
                    <span className="font-mono text-sm">${player.money.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1 text-tycoon-green">
                    <Icon name="Building" size={16} />
                    <span className="text-sm">{player.buildings.length} зданий</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    Доход: ${player.buildings.reduce((total, building) => total + building.income, 0)}/сек
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Building Shop */}
        {currentPlayer && (
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-6 font-['Oswald']">
              Производственные здания
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {buildingTypes.map((building) => {
                const playerBuilding = currentPlayer.buildings.find(b => b.id === building.id);
                const canAfford = currentPlayer.money >= (playerBuilding ? building.cost * playerBuilding.level : building.cost);
                
                return (
                  <Card 
                    key={building.id}
                    className="bg-slate-800/80 border-slate-700 hover:bg-slate-700/80 transition-all duration-300 hover:scale-105"
                  >
                    <CardHeader className="pb-4">
                      <div className="text-center">
                        <div className="text-4xl mb-2">{building.image}</div>
                        <CardTitle className="text-white text-lg font-['Oswald']">
                          {building.name}
                        </CardTitle>
                        {playerBuilding && (
                          <Badge className="mt-2 bg-tycoon-turquoise text-black">
                            Уровень {playerBuilding.level}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Производство:</span>
                          <span className="text-tycoon-green">{building.production}/мин</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Доход:</span>
                          <span className="text-tycoon-yellow">${building.income}/сек</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Стоимость:</span>
                          <span className="text-white">
                            ${(playerBuilding ? building.cost * playerBuilding.level : building.cost).toLocaleString()}
                          </span>
                        </div>
                        <Button 
                          className={`w-full ${
                            canAfford 
                              ? 'bg-tycoon-orange hover:bg-tycoon-orange/80' 
                              : 'bg-gray-600 cursor-not-allowed'
                          }`}
                          disabled={!canAfford}
                          onClick={() => buildBuilding(currentPlayer.id, building)}
                        >
                          {playerBuilding ? 'Улучшить' : 'Построить'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Player Stats */}
        {currentPlayer && currentPlayer.buildings.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-white mb-6 font-['Oswald']">
              Мои предприятия
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentPlayer.buildings.map((building, index) => (
                <Card key={`${building.id}-${index}`} className="bg-slate-800/80 border-slate-700">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{building.image}</div>
                      <div>
                        <CardTitle className="text-white text-lg">{building.name}</CardTitle>
                        <p className="text-tycoon-turquoise">Уровень {building.level}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Производство:</span>
                        <span className="text-tycoon-green">{building.production * building.level}/мин</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Доход:</span>
                        <span className="text-tycoon-yellow">${building.income}/сек</span>
                      </div>
                      <Progress 
                        value={(building.level / 10) * 100} 
                        className="w-full h-2 bg-slate-600"
                      />
                      <p className="text-xs text-gray-400 text-center">
                        Эффективность: {Math.min(building.level * 10, 100)}%
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}